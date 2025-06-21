import React, { useState, useRef, useEffect } from 'react';
import './ChatBotPage.css';
import Header from '../../components/header/Header';
import "../../assets/styles/layout.css"

const ChatBotPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const eventSourceRef = useRef(null);
  const latestBotMessageRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // 스크롤 위치 감지
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

// 탭 눌렀을때 살짝 아래로 이동 (끝 요소를 부드럽게 노출)
const scrollToBottom = () => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }
};

useEffect(() => {
  // 새로고침 직후 페이지를 최상단에서 약간 아래로 이동
  window.scrollTo({ top: 150, left: 0, behavior: 'auto' });
}, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // 진입 시 스크롤을 최상단으로 고정
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  useEffect(() => {
    // 페이지 진입 시 자동으로 welcome 메시지 요청
    const eventSource = new EventSource(`${API_BASE_URL}/api/chatbot/welcome`);
    setIsStreaming(true);
    setMessages(prev => [...prev, { type: 'bot', text: '', loading: true }]);
    latestBotMessageRef.current = 0;

    eventSourceRef.current = eventSource;
    eventSource.onmessage = (event) => {
      updateBotMessage(event.data);
      // Welcome 메시지 종료 조건(예: 마지막 메시지) 필요시 아래 조건 수정
      if (event.data.includes('마지막 메시지')) {
        eventSource.close();
        setIsStreaming(false);
      }
    };
    eventSource.onerror = (error) => {
      console.error('SSE 오류:', error);
      eventSource.close();
      setIsStreaming(false);
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const updateBotMessage = (textChunk) => {
    const safeChunk = textChunk === '' ? '\u00A0' : textChunk; // 공백 처리

    setMessages(prev => {
      const updated = [...prev];
      const index = latestBotMessageRef.current;
      if (index >= 0 && updated[index]) {
        updated[index] = {
          ...updated[index],
          text: updated[index].text + safeChunk,
          loading: false
        };
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const query = input.trim();
    setInput('');
    inputRef.current?.focus();
    setIsStreaming(true);

    setMessages(prev => [...prev, { type: 'user', text: query }, { type: 'bot', text: '', loading: true }]);
    latestBotMessageRef.current = messages.length + 1;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      if (isFirstMessage) {
        // welcome은 GET + EventSource
        const eventSource = new EventSource(`${API_BASE_URL}/api/chatbot/welcome`);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
          updateBotMessage(event.data);
          // Welcome 메시지를 모두 받았는지 체크
          if (event.data.includes('마지막 메시지')) { // 예시
            eventSource.close();
            setIsStreaming(false);
            // 그 다음 recommend(POST) 요청을 보내는 로직
            handleRecommendRequest(query);
          }
          // Welcome 메시지를 모두 받았는지 체크
          if (event.data.includes('마지막 메시지')) { // 예시
            eventSource.close();
            setIsStreaming(false);
            // 그 다음 recommend(POST) 요청을 보내는 로직
            handleRecommendRequest(query);
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE 오류:', error);
          eventSource.close();
          setIsStreaming(false);
        };
      } else {
        // recommend는 POST + fetch + stream
        const response = await fetch(`${API_BASE_URL}/api/chatbot/recommend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userQuery: query
          }),
          credentials: 'include'
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // 여러 줄이 한 번에 들어올 수도 있으니 줄 단위로 파싱
          const lines = buffer.split('\n');
          buffer = lines.pop(); // 마지막 줄은 아직 완성되지 않았을 수 있음

          for (let line of lines) {
            if (line.startsWith('data:')) {
              let text = line.replace(/^data:/, '').trim();
              if (text === '') text = '\u00A0'; // 공백 처리

              // 배열 형태라면 합쳐서 문자열로 변환
              try {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                  text = parsed.join('');
                }
              } catch (e) {
                // JSON 파싱 실패 시 원본 text 그대로 사용
              }

              if (text) updateBotMessage(text);
            }
          }
        }
      }
    } catch (error) {
      console.error('SSE 오류:', error);
      setIsStreaming(false);
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.loading) {
          updated.splice(lastIndex, 1);
        }
        return [...updated, { type: 'bot', text: '오류가 발생했어요. 다시 시도해주세요.' }];
      });
    }

    setIsFirstMessage(false);
    setIsStreaming(false);
  };

  const handleRecommendRequest = async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery: query
        }),
        credentials: 'include'
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // 여러 줄이 한 번에 들어올 수도 있으니 줄 단위로 파싱
        const lines = buffer.split('\n');
        buffer = lines.pop(); // 마지막 줄은 아직 완성되지 않았을 수 있음

        for (let line of lines) {
          if (line.startsWith('data:')) {
            let text = line.replace(/^data:/, '').trim();
            if (text === '') text = '\u00A0'; // 공백 처리

            // 배열 형태라면 합쳐서 문자열로 변환
            try {
              const parsed = JSON.parse(text);
              if (Array.isArray(parsed)) {
                text = parsed.join('');
              }
            } catch (e) {
              // JSON 파싱 실패 시 원본 text 그대로 사용
            }

            if (text) updateBotMessage(text);
          }
        }
      }
    } catch (error) {
      console.error('SSE 오류:', error);
      setIsStreaming(false);
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.loading) {
          updated.splice(lastIndex, 1);
        }
        return [...updated, { type: 'bot', text: '오류가 발생했어요. 다시 시도해주세요.' }];
      });
    }
  };

  return (
    <main className="container">
      <Header />
      <div className="chatbot-wrapper">
        <div className="chatbot-container" style={{position: 'relative'}}>
          <div className="chatbot-header">
            챗봇 상담
          </div>
          <div 
            className="chatbot-messages" 
            ref={messagesContainerRef}
            onScroll={handleScroll}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-row ${msg.type === 'user' ? 'message-user' : 'message-bot'}`}
              >
                <div className={`message-bubble ${msg.type}`}>
                  {msg.text}
                  {msg.loading && <span className="spinner" />}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {showScrollButton && (
            <button 
              className="scroll-to-bottom-btn scroll-to-bottom-btn--fixed"
              onClick={scrollToBottom}
              title="맨 아래로 이동"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="13" stroke="#eee" strokeWidth="2" fill="#fff"/>
                <path d="M14 8V20" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 15L14 20L19 15" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <form onSubmit={handleSubmit} className="chatbot-input-form">
            <input
              type="text"
              ref={inputRef}
              autoFocus
              className="chatbot-input"
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
            />
            <button type="submit" className="chatbot-send-btn" disabled={isStreaming}>
              전송
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ChatBotPage;
