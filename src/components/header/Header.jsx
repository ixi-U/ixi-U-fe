import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logoImg from "../../assets/imgs/ixi-u2.png";
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await fetch(`${process.env.REACT_APP_API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/plans");
  };

  const isLoginPage = location.pathname === "/login";

  return (
    <header className="service-header">
      <div className="header-left">
        <img
          src={logoImg}
          alt="ixi-U logo"
          className="logo-text"
          style={{ cursor: "pointer", width: 120, height: "auto" }}
          onClick={() => navigate("/")}
        />
        <div className="tab-group">
          <button
            className={`tab ${
              location.pathname.startsWith("/plans") ? "active" : ""
            }`}
            onClick={() => navigate("/plans")}
          >
            모바일
          </button>
          <button
            className={`tab ${
              location.pathname.startsWith("/chatbot") ? "active" : ""
            }`}
            onClick={() => navigate("/chatbot")}
          >
            챗봇
          </button>
          <button
            className={`tab ${
              location.pathname.startsWith("/mypage") ? "active" : ""
            }`}
            onClick={() => navigate("/mypage")}
          >
            마이페이지
          </button>
        </div>
      </div>
      {!isLoginPage && !isLoading && (
        <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="user-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="user-svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-.75z" />
            </svg>
          </span>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="login-btn">로그아웃</button>
          ) : (
            <button onClick={() => navigate("/login")} className="login-btn">로그인</button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;