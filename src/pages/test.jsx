import React, { useEffect, useState, useCallback, useRef } from "react";
import logoImg from "../assets/ixi-u.png";
import { useNavigate } from "react-router-dom";
import { fetchPlans } from "../api/planApi";
import KakaoLoginBtn from "../assets/kakao-login.png";
import "../components/test.css";

export default function Test() {
  const [activeTab, setActiveTab] = useState("모바일");
  const [planType, setPlanType] = useState("5G/LTE");
  const [sortOption, setSortOption] = useState("PRIORITY");
  const [plans, setPlans] = useState([]);
  const [lastCursor, setLastCursor] = useState({
    planId: null,
    sortValue: null,
  });
  const [hasNext, setHasNext] = useState(false);
  const [keyword, setKeyword] = useState("");
  const sentinelRef = useRef(null);
  const navigate = useNavigate();

  const loadPlans = useCallback(
    async (cursor = null, isNext = false) => {
      const query = {
        size: 2,
        planType,
        sortOption,
        searchKeyword: keyword,
      };

      if (isNext && cursor?.planId != null && cursor.sortValue != null) {
        query.planId = cursor.planId;
        query.cursorSortValue = cursor.sortValue;
      }

      const data = await fetchPlans(query);

      setPlans((prev) =>
        isNext ? [...prev, ...data.plans.content] : data.plans.content
      );
      setLastCursor({
        planId: data.lastPlanId,
        sortValue: data.lastSortValue,
      });
      setHasNext(data.plans.last === false);
    },
    [planType, sortOption, keyword]
  );

  useEffect(() => {
    loadPlans(null, false);
  }, [planType, sortOption, keyword, loadPlans]);

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
    <main className="plan-page">
      {/* 상단 바: 로고 + 탭 메뉴 수직 정렬 */}
      <header className="service-header">
        <div className="logo-and-tabs">
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
      </header>

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
