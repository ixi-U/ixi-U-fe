// src/components/AdminLayout.jsx
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logoImg from "../assets/ixi-u.png";
import "../components/AdminLayout.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("마이페이지");

  return (
    <div className="plan-page">
      <header className="service-header">
        {/* 좌측 로고 */}
        <img src={logoImg} alt="ixi-U logo" className="logo" />

        {/* 가운데 메뉴 */}
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

        {/* 우측 로그인 */}
        <button className="login-btn" onClick={() => navigate("/")}>
          로그인
        </button>
      </header>

      <div
        className="admin-body"
        style={{ display: "flex", marginTop: "24px" }}
      >
        <aside
          className="admin-sidebar"
          style={{
            minWidth: "200px",
            padding: "20px",
            borderRight: "1px solid #eee",
          }}
        >
          <h2 style={{ marginBottom: "16px" }}>마이페이지</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link to="/mypage/info">나의 정보</Link>
            </li>
            <li>
              <Link to="/mypage/history">요금제 히스토리</Link>
            </li>
            <li>
              <Link to="/mypage/conversations">대화 내역</Link>
            </li>
            <li>
              <Link to="/mypage/leave">회원 탈퇴</Link>
            </li>
            <li
              className={location.pathname.includes("register") ? "active" : ""}
            >
              <Link to="/mypage/plan/register">요금제 등록</Link>
            </li>
            <li
              className={location.pathname.includes("delete") ? "active" : ""}
            >
              <Link to="/mypage/plan/delete">요금제 삭제</Link>
            </li>
          </ul>
        </aside>

        <main className="admin-content" style={{ flex: 1, padding: "24px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
