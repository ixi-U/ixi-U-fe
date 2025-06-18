import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import Header from "../../components/header/Header";
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("마이페이지");
  return (
    <div className="plan-page">
      <Header />
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