import React, { useState, useEffect } from "react";
import logoImg from "../../assets/imgs/ixi-u.png";
import { useNavigate } from "react-router-dom";
import "../../pages/login/Onboarding.css";

const Onboarding = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [activeTab, setActiveTab] = useState("모바일");
  const [plans, setPlans] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanNames = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE}/plans/summaries`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log("📦 서버 응답 (요금제):", data);
        setPlans(data);
      } catch (error) {
        console.error("요금제 불러오기 실패:", error);
      }
    };

    fetchPlanNames();
  }, []);

  const handleSkip = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/user/onboarding`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, planId: selectedPlanId }), // planid가 null로 가는 문제 -> dto 변수랑 맞춰줌
        }
      );

      if (!response.ok) {
        // try-catch로 하니까 둘 다 실행되는 문제 발생
        const errorText = await response.text();
        throw new Error(errorText || "회원가입 실패");
      }

      alert("회원가입 완료!");

      try {
        console.log("onSubmit 호출");
        onSubmit({ email, selectedPlanId });
      } catch (submitErr) {
        console.error("onSubmit 중 오류:", submitErr);
      }

      try {
        console.log("navigate 호출");
        navigate("/plans");
      } catch (navErr) {
        console.error("navigate 중 오류:", navErr);
      }
    } catch (error) {
      console.error("온보딩 실패:", error);
      alert("회원가입 실패");
    }
  };

  return (
    <main className="plan-page">
      {/* 상단 바 */}
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

      {/* 온보딩 폼 */}
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
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          className="onboarding-select"
        >
          <option value="">선택 안함</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
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
