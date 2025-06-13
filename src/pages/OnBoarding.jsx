import React, { useState } from "react";
import "../styles/Onboarding.css";

const Onboarding = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleSkip = () => {
    // 이메일과 요금제 서버로 제출
    onSubmit({ email, selectedPlan });
  };

  return (
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
        회원가입
      </button>
    </div>
  );
};

export default Onboarding;
