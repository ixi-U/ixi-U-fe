import React, { useState } from "react";
import KakaoLoginBtn from "../../assets/imgs/kakao-login.png";
import ChatbotButton from "../chatbot/ChatbotButton";
import "../../pages/login/SocialLogin.css";
import Header from "../../components/header/Header";
import "../../assets/styles/layout.css";
import { useNavigate } from "react-router-dom";

export default function SocialLogin() {
  const [selectedRole, setSelectedRole] = useState("personal");
  const [adminKey, setAdminKey] = useState("");
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    const kakaoAuthUrl = `${process.env.REACT_APP_API_BASE}/oauth2/authorization/kakao?role=${selectedRole}`;
    window.location.href = kakaoAuthUrl;
  };

  const handleAdminVerify = async () => {
    if (adminKey === "admin123") {
      setIsAdminVerified(true);
      alert("어드민 인증 성공!");
      navigate("/admin");
      return;
    } else {
      alert("어드민 인증 키가 일치하지 않습니다");
      return;
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
            opacity: selectedRole === "personal" || adminKey ? 1 : 0.5,
            pointerEvents:
              selectedRole === "personal" || adminKey ? "auto" : "none",
          }}
        />
      </section>

      {/* <ChatbotButton onClick={() => navigate('/chatbot')} /> */}
    </main>
  );
}
