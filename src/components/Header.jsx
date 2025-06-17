import React from "react";
import './Header.css';

const Header = () => (
  <header className="mypage-header">
    <div className="header-left">
      <span className="logo-text">서비스 로고</span>
      <button className="mobile-btn">모바일 버튼</button>
      <div className="tab-group">
        <button className="tab active">마이페이지</button>
      </div>
    </div>
    <div className="header-user">
      <span className="user-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="user-svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-.75z" />
        </svg>
      </span>
    </div>
  </header>
);

export default Header; 