import React from "react";
import '../user/Sidebar.css';

const AdminSidebar = ({ activeMenu = "요금제 추가", onMenuClick }) => {
  const menus = [
    "요금제 추가",
    "요금제 수정&삭제"
  ];
  return (
    <aside className="mypage-sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-title">요금제 관리</div>
        <ul className="sidebar-menu">
          {menus.map((menu) => (
            <li key={menu}>
              <span
                className={`sidebar-menu-item${activeMenu === menu ? " active" : ""}`}
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

export default AdminSidebar; 