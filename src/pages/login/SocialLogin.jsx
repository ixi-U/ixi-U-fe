import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KakaoLoginBtn from "../../assets/imgs/kakao-login.png";
import "../../pages/login/SocialLogin.css";
import Header from "../../components/header/Header"
import "../../assets/styles/layout.css"

export default function SocialLogin() {
  const [selectedRole, setSelectedRole] = useState("personal");
  const [adminKey, setAdminKey] = useState("");
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  const handleLogin = () => {
    const kakaoAuthUrl = `http://localhost:8080/oauth2/authorization/kakao?role=${selectedRole}`;
    window.location.href = kakaoAuthUrl;
  };

  const handleAdminVerify = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/verify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });

      if (res.ok) {
        setIsAdminVerified(true);
        alert("어드민 인증 성공!");
      } else {
        setIsAdminVerified(false);
        alert("어드민 인증 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류 발생");
    }
  };

  return (
    <main className="container">
      {/* 상단 바: 로고 | 탭 메뉴 | 로그인 */}
      <Header />

      {/* 로그인 */}
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
            어드민
          </button>
        </div>

        {selectedRole === "business" && (
          <div className="admin-input-box">
            <input
              type="text"
              placeholder="어드민 인증 키 입력"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="admin-key-input"
            />
            <button className="admin-verify-btn" onClick={handleAdminVerify}>
              승인
            </button>
          </div>
        )}

        <img
          src={KakaoLoginBtn}
          alt="카카오 로그인 버튼"
          className="login-button"
          onClick={handleLogin}
          style={{
            opacity: selectedRole === "personal" || isAdminVerified ? 1 : 0.5,
            pointerEvents:
              selectedRole === "personal" || isAdminVerified ? "auto" : "none",
          }}
        />
      </section>

      <button className="chatbot-button">
        챗봇
        <br />
        버튼
      </button>
    </main>
  );
}
