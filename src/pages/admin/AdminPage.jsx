import React, { useEffect, useState } from 'react';
import '../../assets/styles/layout.css';
import '../user/MyPage.css';
import './AdminLayout.css';
import { getMyInfo } from '../../api/userApi';
import RegisterPlanPage from './RegisterPlanPage';
import DeletePlanPage from './DeletePlanPage';
import AdminSidebar from './AdminSidebar';
import Header from '../../components/header/Header';

export default function AdminPage() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('요금제 추가');

  useEffect(() => {
    getMyInfo()
      .then(data => setAdmin(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return null; // Footer도 렌더링 안 됨
  }
  return (
    <main className="container">
      {/* 상단 바: 로고 | 탭 메뉴 | 로그인 */}
      <Header />
      
      <div className="mypage-body">
        <AdminSidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />
        <main className="mypage-main">
          <div className="admin-header">
            <h2>관리자 <span style={{color: '#222'}}>{admin ? admin.name : ''}</span></h2>
          </div>
          <div className="admin-content">
            {activeMenu === '요금제 추가' && <RegisterPlanPage />}
            {activeMenu === '요금제 수정&삭제' && <DeletePlanPage />}
          </div>
        </main>
      </div>
    </main>
  );
} 