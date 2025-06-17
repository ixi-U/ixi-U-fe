import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Sidebar from "./Sidebar";
import InfoCard from "./InfoCard";
import ChatbotButton from "../chatbot/ChatbotButton";
import PlanHistoryList from "../user/PlanHistoryList";
import { deleteUser, getMyInfo, getMyPlan } from "../../api/userApi";
import './MyPage.css';
import "../../assets/styles/layout.css"

// // 예시 데이터 (향후 API 연동 예정)
// const user = {
//   name: "임*현",
//   joinDate: "2023-01-01",
//   partner: "-",
//   lastReview: "-",
// };
const currentPlan = null; // 사용중인 요금제 정보 (없음)
const preferredPlan = null; // 선호 요금제 정보 (없음)

const MyPage = () => {
  const [activeMenu, setActiveMenu] = useState("나의 정보");
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getMyInfo(),
      getMyPlan()
    ])
      .then(([userData, planData]) => {
        setUser(userData);
        setCurrentPlan(planData);
        setLoading(false);
      })
      .catch(() => {
        setError('유저 정보를 불러오지 못했습니다.');
        setLoading(false);
      });
  }, []);

  // 회원 탈퇴 요청 함수
  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      await deleteUser();
      alert('회원 탈퇴가 완료되었습니다.');
      window.location.href = '/';
    } catch (err) {
      alert('탈퇴에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="container">
      <Header />
      <div className="mypage-body">
        <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />
        <main className="mypage-main">
          {activeMenu === "나의 정보" && <>
            <h1 className="mypage-greeting">
              {loading ? '로딩 중...' : error ? error : `${user?.name || ''}님, 안녕하세요.`}
            </h1>

            {/* 사용중인 요금제 */}
            <InfoCard title="사용중인 요금제">
              {loading ? (
                <div>로딩 중...</div>
              ) : error ? (
                <div>{error}</div>
              ) : currentPlan ? (
                <div>
                  <div><b>요금제 이름:</b> {currentPlan.name}</div>
                  <div>
                    <b>데이터:</b> {currentPlan.mobileDataLimitMb !== null && currentPlan.mobileDataLimitMb !== undefined
                      ? `${currentPlan.mobileDataLimitMb}MB`
                      : currentPlan.pricePerKb !== undefined
                        ? `1KB당 ${currentPlan.pricePerKb}원 과금`
                        : '정보 없음'}
                  </div>
                  {currentPlan.mobileDataLimitMb !== null && currentPlan.mobileDataLimitMb !== undefined && (
                    <div><b>월 요금:</b> {currentPlan.monthlyPrice.toLocaleString()}원</div>
                  )}
                  {Array.isArray(currentPlan.bundledBenefits) && currentPlan.bundledBenefits.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <b>묶음 혜택:</b>
                      <ul>
                        {currentPlan.bundledBenefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(currentPlan.singleBenefits) && currentPlan.singleBenefits.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <b>단일 혜택:</b>
                      <ul>
                        {currentPlan.singleBenefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="info-card-empty">
                  <span>사용중인 요금제가 없습니다.</span>
                  <a href="#" className="info-card-link">어떤 요금제를 선택할지 고민되시나요? 챗봇에게 물어보러가기</a>
                </div>
              )}
            </InfoCard>

            {/* 선호 요금제 */}
            <InfoCard title="선호 요금제">
              {preferredPlan ? (
                <div>{preferredPlan.name}</div>
              ) : (
                <div className="info-card-empty">
                  <span>입력된 정보가 없습니다.</span>
                  <a href="#" className="info-card-link">
                    선호하시는 요금을 입력하면 더욱더 적합한 요금제를 추천할 수 있어요! 선호 요금제 입력하러가기
                  </a>
                </div>
              )}
            </InfoCard>

            {/* 나의 정보 */}
            {user && (
              <section className="info-card">
                <h2 className="info-card-title">나의 정보</h2>
                <div className="info-card-content info-card-grid">
                  <div>
                    <div>사용자 명 : {user.name}</div>
                    <div>가입일 : {user.createdAt}</div>
                  </div>
                  <div>
                    <div>나와 결합된 사용자 : {user.partner}</div>
                    <div>최근 작성한 리뷰 : {user.lastReview}</div>
                  </div>
                </div>
              </section>
            )}
          </>}
          {activeMenu === "요금제 히스토리" && <PlanHistoryList />}
          {activeMenu === "회원 탈퇴" && (
            <div style={{ textAlign: 'center', marginTop: 80 }}>
              <p style={{ fontSize: '1.1rem', marginBottom: 24 }}>정말 탈퇴하시겠습니까?</p>
              <button
                className="plan-history-change-btn"
                style={{ background: '#f3e1ec', color: '#e91e63', fontWeight: 600, fontSize: '1.1rem', padding: '12px 32px', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                onClick={handleDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? '처리 중...' : '탈퇴 신청'}
              </button>
            </div>
          )}
        </main>
      </div>
      <ChatbotButton />
      </main>
  );
};

export default MyPage; 