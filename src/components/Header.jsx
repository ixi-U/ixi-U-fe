import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Header.css';
import logoImg from '../assets/ixi-u.png';

const Header = () => {
  const [user, setUser] = useState(null); // 사용자 상태 저장
  const navigate = useNavigate();

  // 로그인 여부 확인 (경로 최신화)
  useEffect(() => {
    fetch("http://localhost:8080/api/user/info", {
      credentials: "include", // 쿠키 포함 (access_token)
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
    <header className="mypage-header">
      <div className="header-left">
        <img
          src={logoImg}
          alt="ixi-U logo"
          className="logo-text"
          style={{ cursor: 'pointer', width: 120, height: 'auto' }}
          onClick={() => navigate('/mainPage')}
        />
        <button className="mobile-btn">모바일 버튼</button>
        <div className="tab-group">
          <button className="tab active" onClick={() => navigate('/mypage')}>마이페이지</button>
        </div>
      </div>
      <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span className="user-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="user-svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-.75z" />
          </svg>
        </span>
        {user ? (
          <button onClick={handleLogout} className="login-btn">로그아웃</button>
        ) : (
          <button onClick={() => navigate("/")} className="login-btn">로그인</button>
        )}
      </div>
    </header>
  );
};

export default Header;
