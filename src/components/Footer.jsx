import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="main-footer">
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-info">
          <p>&copy; 2025 IXI-U. All rights reserved.</p>
          <p>고객센터: 010-8937-6522 | 이메일: support@ixi-u.com</p>
        </div>
        <div className="footer-links">
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="https://github.com/ixi-U">회사소개</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 