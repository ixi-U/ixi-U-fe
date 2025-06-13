import React, { useState } from "react";
import KakaoLoginBtn from "../assets/kakao-login.png";
import LogoImg from "../assets/ixi-u2.png";
import "../styles/SocialLogin.css";

const SocialLogin = () => {
  const [selectedRole, setSelectedRole] = useState("personal");

  const handleLogin = () => {
    const kakaoAuthUrl = `http://localhost:8080/oauth2/authorization/kakao?role=${selectedRole}`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className="login-container">
      {/* 로고 영역 */}
      <header className="login-header">
        <img src={LogoImg} alt="서비스 로고" className="login-logo" />
      </header>

      {/* 메뉴 영역 */}
      <section className="menu-section">
        <button className="login-tab">모바일</button>
        <button className="login-tab">마이페이지</button>
      </section>

      {/* 로그인 메인 영역 */}
      <section className="login-section">
        <h1 className="login-title">로그인</h1>
        <p className="login-subtext">
          어떤 방법으로 로그인/회원가입 하시겠어요?
        </p>

        <div className="login-role-tabs">
          <button
            className={`login-role-tab ${
              selectedRole === "personal" ? "active" : ""
            }`}
            onClick={() => setSelectedRole("personal")}
          >
            개인 회원
          </button>
          <button
            className={`login-role-tab ${
              selectedRole === "business" ? "active" : ""
            }`}
            onClick={() => setSelectedRole("business")}
          >
            사업자 회원
          </button>
        </div>

        <img
          src={KakaoLoginBtn}
          alt="카카오 로그인 버튼"
          className="login-button"
          onClick={handleLogin}
        />
      </section>

      <button className="chatbot-button">
        챗봇
        <br />
        버튼
      </button>
    </div>
  );
};

export default SocialLogin;
