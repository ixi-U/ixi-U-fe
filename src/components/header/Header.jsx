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
    if (!isLoggedIn) {
      alert("현재 로그아웃 상태입니다.");
      return;
    }
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      
      if (res.ok) {
        alert("로그아웃 되었습니다.");
        window.location.href = "/";
      } else {
        // 401 에러가 발생해도 로그아웃 처리 (토큰이 만료된 경우)
        if (res.status === 401) {
          alert("로그아웃 되었습니다.");
          window.location.href = "/";
        } else {
          alert("로그아웃 중 오류가 발생했습니다.");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
      // 네트워크 에러가 발생해도 로그아웃 처리
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    }
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