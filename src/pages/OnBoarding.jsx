import React, { useState } from "react";
import logoImg from "../assets/ixi-u.png";
import { useNavigate } from "react-router-dom";
import "../components/Onboarding.css";

const Onboarding = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [activeTab, setActiveTab] = useState("모바일");

  const navigate = useNavigate();

  const handleSkip = () => {
    onSubmit({ email, selectedPlan });
  };

  return (
    <main className="plan-page">
      {/* 상단 바: 로고 | 탭 메뉴 | 로그인 */}
      <header className="service-header">
        <div className="header-left">
          <img src={logoImg} alt="ixi-U logo" className="logo" />
          <nav className="service-tabs">
            {["모바일", "마이페이지"].map((tab) => (
              <button
                key={tab}
                className={tab === activeTab ? "tab active" : "tab"}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <button className="login-btn" onClick={() => navigate("/")}>
          로그인
        </button>
      </header>

      <div className="onboarding-container">
        <h2>회원가입</h2>
        <h3>신규 회원 회원가입을 진행합니다.</h3>

        <label className="onboarding-label">이메일 입력 (필수)</label>
        <input
          type="email"
          placeholder="example@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="onboarding-input"
        />

        <label className="onboarding-label">사용 요금제 선택 (선택)</label>
        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="onboarding-select"
        >
          <option value="">선택 안함</option>
          <option value="basic">기본 요금제</option>
          <option value="premium">프리미엄 요금제</option>
        </select>

        <button
          className="onboarding-skip-btn"
          disabled={!email}
          onClick={handleSkip}
        >
          회원가입
        </button>

        <button className="chatbot-button">
          챗봇
          <br />
          버튼
        </button>
      </div>
    </main>
  );
};

export default Onboarding;
