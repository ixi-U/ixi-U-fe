import React from "react";
import './ChatbotButton.css';

const ChatbotButton = ({ onClick }) => (
  <button
    className="chatbot-btn"
    onClick={onClick}
    aria-label="챗봇 버튼"
  >
    챗봇
  </button>
);

export default ChatbotButton; 