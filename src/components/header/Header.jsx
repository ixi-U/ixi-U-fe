// 로그인/로그아웃 상테애 따라 다른 버튼
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState(null); // 사용자 상태 저장
  const navigate = useNavigate(); // 페이지 이동 navi-

  // page 처음 랜더링 시 로그인 여부 확인
  useEffect(() => {
    fetch("http://localhost:8080/api/user/me", {
      credentials: "include", // ← 쿠키 포함 (access_token)
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/plans");
  };

  return (
    <header>
      {user ? (
        <button onClick={handleLogout}>로그아웃</button>
      ) : (
        <button onClick={() => navigate("/")}>로그인</button>
      )}
    </header>
  );
};

export default Header;
<header className="service-header">
        {/* 좌측 로고 */}
        <img src={logoImg} alt="ixi-U logo" className="logo" />

        {/* 가운데 메뉴 */}
        <nav className="service-tabs">
          {['모바일', '마이페이지'].map(
            (tab) => (
              <button
                key={tab}
                className={tab === activeTab ? 'tab active' : 'tab'}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </nav>

        {/* 우측 로그인 */}
        <button className="login-btn" onClick={() => navigate('/')}>
          로그인
        </button>
      </header>