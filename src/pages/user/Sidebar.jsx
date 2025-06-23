import React from "react";
import './Sidebar.css';

const Sidebar = ({ activeMenu = "나의 정보", onMenuClick }) => {
  const menus = [
    "나의 정보",
    "요금제 히스토리",
    "회원 탈퇴",
  ];
  return (
    <aside className="mypage-sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-title">마이페이지</div>
        <ul className="sidebar-menu">
          {menus.map((menu) => (
            <li key={menu}>
              <span
                className={`sidebar-menu-item${activeMenu === menu ? " active" : ""}${menu === "회원 탈퇴" ? " member-leave" : ""}`}
                onClick={() => onMenuClick && onMenuClick(menu)}
                style={{ cursor: 'pointer' }}
              >
                {menu}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 