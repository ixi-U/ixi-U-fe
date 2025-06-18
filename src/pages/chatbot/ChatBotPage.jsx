import React, { useState, useRef, useEffect } from 'react';
import './ChatBotPage.css';
import Header from '../../components/header/Header';
import "../../assets/styles/layout.css"

const ChatBotPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const eventSourceRef = useRef(null);
  const latestBotMessageRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // 스크롤 위치 감지
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // 새 메시지가 생기면 스크롤을 맨 아래로 이동
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const query = input.trim();
    setInput('');
    setIsStreaming(true);

    setMessages(prev => [...prev, { type: 'user', text: query }, { type: 'bot', text: '', loading: true }]);
    latestBotMessageRef.current = messages.length + 1;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const updateBotMessage = (textChunk) => {
      setMessages(prev => {
        const updated = [...prev];
        const index = latestBotMessageRef.current;
        if (index >= 0 && updated[index]) {
          updated[index] = {
            ...updated[index],
            text: updated[index].text + textChunk,
            loading: false
          };
        }
        return updated;
      });
    };

    const endpoint = isFirstMessage ? '/api/chatbot/welcome' : '/api/chatbot/stream';
    const eventSource = new EventSource(`${API_BASE_URL}${endpoint}?message=${encodeURIComponent(query)}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      updateBotMessage(event.data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE 오류:', error);
      eventSource.close();
      setIsStreaming(false);
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.loading) {
          updated.splice(lastIndex, 1);
        }
        return [...updated, { type: 'bot', text: '오류가 발생했어요. 다시 시도해주세요.' }];
      });
    };

    setIsFirstMessage(false);
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
