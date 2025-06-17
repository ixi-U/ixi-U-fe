import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import InfoCard from "../components/InfoCard";
import ChatbotButton from "../components/ChatbotButton";
import PlanHistoryList from "../components/PlanHistoryList";
import './MyPage.css';

// 예시 데이터 (향후 API 연동 예정)
const user = {
  name: "임*현",
  joinDate: "2023-01-01",
  partner: "-",
  lastReview: "-",
};
const currentPlan = null; // 사용중인 요금제 정보 (없음)
const preferredPlan = null; // 선호 요금제 정보 (없음)

const MyPage = () => {
  const [activeMenu, setActiveMenu] = useState("나의 정보");

  return (
    <div className="mypage-root">
      <Header />
      <div className="mypage-body">
        <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />
        <main className="mypage-main">
          {activeMenu === "나의 정보" && <>
            <h1 className="mypage-greeting">
              {user.name}님, 안녕하세요.
            </h1>

            {/* 사용중인 요금제 */}
            <InfoCard title="사용중인 요금제">
              {currentPlan ? (
                <div>{currentPlan.name}</div>
              ) : (
                <div className="info-card-empty">
                  <span>사용중인 요금제가 없습니다.</span>
                  <a href="#" className="info-card-link">
                    어떤 요금제를 선택할지 고민되시나요? 챗봇에게 물어보러가기
                  </a>
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
            <section className="info-card">
              <h2 className="info-card-title">나의 정보</h2>
              <div className="info-card-content info-card-grid">
                <div>
                  <div>사용자 명 : {user.name}</div>
                  <div>가입일 : {user.joinDate}</div>
                </div>
                <div>
                  <div>나와 결합된 사용자 : {user.partner}</div>
                  <div>최근 작성한 리뷰 : {user.lastReview}</div>
                </div>
              </div>
            </section>
          </>}
          {activeMenu === "요금제 히스토리" && <PlanHistoryList />}
        </main>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default MyPage; 