import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Sidebar from "./Sidebar";
import InfoCard from "./InfoCard";
import ChatbotButton from "../chatbot/ChatbotButton";
import PlanHistoryList from "../user/PlanHistoryList";
import { deleteUser, getMyInfo, getMyPlan } from "../../api/userApi";
import './MyPage.css';
import "../../assets/styles/layout.css"
import useAuth from '../../hooks/useAuth';
import { fetchPlans } from "../../api/planApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const { isLoggedIn, isLoading } = useAuth();
  const [activeMenu, setActiveMenu] = useState("나의 정보");
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [allPlans, setAllPlans] = useState([]);
  const [registering, setRegistering] = useState(false);
  const [planType, setPlanType] = useState('5G/LTE');
  const navigate = useNavigate();

  // 혜택 데이터를 안전하게 렌더링하는 헬퍼 함수
  const renderBenefit = (benefit) => {
    if (typeof benefit === 'string') {
      return benefit;
    } else if (typeof benefit === 'object' && benefit !== null) {
      // 객체인 경우 name, title, description 등의 속성을 찾아서 표시
      if (benefit.name) return benefit.name;
      if (benefit.title) return benefit.title;
      if (benefit.description) return benefit.description;
      if (benefit.benefitName) return benefit.benefitName;
      if (benefit.benefitType) return benefit.benefitType;
      // 객체의 첫 번째 문자열 속성을 찾아서 표시
      for (const key in benefit) {
        if (typeof benefit[key] === 'string' && benefit[key].trim()) {
          return benefit[key];
        }
      }
      // 문자열 속성이 없으면 JSON으로 표시
      return JSON.stringify(benefit);
    } else {
      return String(benefit || '');
    }
  };

  useEffect(() => {
    // 로그인 상태가 확인된 후에만 데이터를 불러옵니다.
    if (isLoading) return; // 로딩 중에는 아무것도 하지 않음
    if (!isLoggedIn) {
      setLoading(false); // 로딩 상태 종료
      return;
    }

    setLoading(true);
    setError(null);
    
    Promise.all([
      getMyInfo().catch(err => {
        console.error('Error fetching user info:', err);
        return null;
      }),
      getMyPlan().catch(err => {
        console.error('Error fetching plan info:', err);
        return null;
      })
    ])
      .then(([userData, planData]) => {
        console.log('User data:', userData);
        console.log('Plan data:', planData);
        
        // 혜택 데이터 구조 확인
        if (planData && planData.bundledBenefits) {
          console.log('Bundled benefits structure:', planData.bundledBenefits);
          console.log('Bundled benefits length:', planData.bundledBenefits.length);
          planData.bundledBenefits.forEach((benefit, index) => {
            console.log(`Bundled benefit ${index}:`, benefit);
            console.log(`Bundled benefit ${index} name:`, benefit.name);
          });
        }
        if (planData && planData.singleBenefits) {
          console.log('Single benefits structure:', planData.singleBenefits);
          console.log('Single benefits length:', planData.singleBenefits.length);
          planData.singleBenefits.forEach((benefit, index) => {
            console.log(`Single benefit ${index}:`, benefit);
            console.log(`Single benefit ${index} name:`, benefit.name);
          });
        }
        
        // 데이터 검증
        if (userData && typeof userData === 'object') {
          setUser(userData);
        } else {
          console.warn('Invalid user data received:', userData);
          setUser(null);
        }
        
        if (planData && typeof planData === 'object') {
          setCurrentPlan(planData);
        } else {
          console.warn('Invalid plan data received:', planData);
          setCurrentPlan(null);
        }
        
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error in useEffect:', error);
        setError('유저 정보를 불러오지 못했습니다.');
        setLoading(false);
      });
  }, [isLoggedIn, isLoading]);

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

  const openPlanModal = async () => {
    setShowPlanModal(true);
    const data = await fetchPlans({ size: 100, planType: planType, sortOption: 'PRIORITY' });
    setAllPlans(data.plans?.content || []);
  };

  const handlePlanTypeChange = async (e) => {
    const newType = e.target.value;
    setPlanType(newType);
    const data = await fetchPlans({ size: 100, planType: newType, sortOption: 'PRIORITY' });
    setAllPlans(data.plans?.content || []);
  };

  const handleSubscribe = async (planId) => {
    setRegistering(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE}/subscribed`,
        { planId },
        { withCredentials: true }
      );
      alert("요금제가 등록되었습니다!");
      setShowPlanModal(false);
      
      // 새로운 요금제 정보 가져오기
      const planData = await getMyPlan().catch(err => {
        console.error('Error fetching updated plan:', err);
        return null;
      });
      
      console.log('Updated plan data:', planData);
      
      if (planData && typeof planData === 'object') {
        setCurrentPlan(planData);
      } else {
        console.warn('Invalid updated plan data:', planData);
        setCurrentPlan(null);
      }
    } catch (e) {
      console.error('Subscribe error:', e);
      alert("등록 실패");
    } finally {
      setRegistering(false);
    }
  };

  // TODO: 로그인 제한 복구
  // 로그인 여부와 상관없이 항상 컨텐츠 렌더
  return (
    <main className="container">
      <Header />
      <div className="mypage-body">
        {isLoading ? (
          <div className="mypage-message">
            <h2>로딩 중...</h2>
          </div>
        ) : isLoggedIn ? (
          <>
            <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />
            <main className="mypage-main">
              {activeMenu === "나의 정보" && <>
                <h1 className="mypage-greeting">
                  {loading ? '로딩 중...' : error ? error : `${user?.name || ''}님, 안녕하세요.`}
                </h1>

                {/* 사용중인 요금제 */}
                <InfoCard title={
                  <span>
                    사용중인 요금제
                    <button
                      onClick={openPlanModal} className="register"
                    >
                      등록하기
                    </button>
                  </span>
                }>
                  {loading ? (
                    <div>로딩 중...</div>
                  ) : error ? (
                    <div>{error}</div>
                  ) : currentPlan && typeof currentPlan === 'object' && currentPlan !== null ? (
                    <div>
                      <div><b>요금제 이름:</b> {String(currentPlan.name || '정보 없음')}</div>
                      <div>
                        <b>데이터:</b> {
                          currentPlan.mobileDataLimitMb !== null && 
                          currentPlan.mobileDataLimitMb !== undefined && 
                          !isNaN(currentPlan.mobileDataLimitMb)
                            ? `${currentPlan.mobileDataLimitMb}MB`
                            : currentPlan.pricePerKb !== undefined && !isNaN(currentPlan.pricePerKb)
                              ? `1KB당 ${currentPlan.pricePerKb}원 과금`
                              : '정보 없음'
                        }
                      </div>
                      {currentPlan.monthlyPrice !== null && 
                       currentPlan.monthlyPrice !== undefined && 
                       !isNaN(currentPlan.monthlyPrice) && (
                        <div><b>월 요금:</b> {Number(currentPlan.monthlyPrice).toLocaleString()}원</div>
                      )}
                      {Array.isArray(currentPlan.bundledBenefits) && currentPlan.bundledBenefits.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <b>묶음 혜택:</b>
                          <ul>
                            {currentPlan.bundledBenefits.map((bundledBenefit, i) => (
                              <li key={i}>
                                <div><strong>{bundledBenefit.name}</strong></div>
                                {bundledBenefit.subscript && (
                                  <div style={{ fontSize: '0.9em', color: '#666', marginTop: 4 }}>
                                    {bundledBenefit.subscript}
                                  </div>
                                )}
                                {Array.isArray(bundledBenefit.singleBenefits) && bundledBenefit.singleBenefits.length > 0 && (
                                  <ul style={{ marginTop: 8, marginLeft: 20 }}>
                                    {bundledBenefit.singleBenefits.map((singleBenefit, j) => (
                                      <li key={j} style={{ fontSize: '0.9em', marginBottom: 4 }}>
                                        • {singleBenefit.name}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {Array.isArray(currentPlan.singleBenefits) && currentPlan.singleBenefits.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <b>단일 혜택:</b>
                          <ul>
                            {currentPlan.singleBenefits.map((singleBenefit, i) => (
                              <li key={i}>
                                <div>{singleBenefit.name}</div>
                                {singleBenefit.subscript && (
                                  <div style={{ fontSize: '0.9em', color: '#666', marginTop: 4 }}>
                                    {singleBenefit.subscript}
                                  </div>
                                )}
                              </li>
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

                

                {/* 나의 정보 */}
                {user && (
                  <section className="info-card">
                    <h2 className="info-card-title">나의 정보</h2>
                    <div className="info-card-content info-card-grid">
                      <div>
                        <div>사용자 명 : {user.name}</div>
                        <div>가입일 : {user.createdAt}</div>
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
                    onClick={handleDeleteUser}
                    disabled={isDeleting}
                  >
                    {isDeleting ? '처리 중...' : '탈퇴 신청'}
                  </button>
                </div>
              )}
              {showPlanModal && (
                <div className="plan-modal-backdrop">
                  <div className="plan-modal">
                    <h3>요금제 선택</h3>
                    <div style={{marginBottom:16}}>
                      <label style={{marginRight:8}}>플랜 타입:</label>
                      <select value={planType} onChange={handlePlanTypeChange} style={{padding:'6px 12px', borderRadius:6}}>
                        <option value="5G/LTE">5G/LTE</option>
                        <option value="ONLINE">ONLINE</option>
                        <option value="TABLET/SMARTWATCH">TABLET/SMARTWATCH</option>
                        <option value="DUAL_NUMBER">DUAL_NUMBER</option>
                      </select>
                    </div>
                    <ul>
                      {allPlans.map(plan => (
                        <li key={plan.id} style={{marginBottom:8}}>
                          <span>{plan.name}</span>
                          <button
                            style={{marginLeft:12, padding:"4px 12px"}}
                            disabled={registering}
                            onClick={() => handleSubscribe(plan.id)}
                          >
                            선택
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => setShowPlanModal(false)} className="register-select">닫기 </button>
                  </div>
                </div>
              )}
            </main>
          </>
        ) : (
          <div className="mypage-message">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <h2>로그인이 필요한 서비스입니다.</h2>
            <p>로그인 후 마이페이지의 모든 기능을 이용해보세요.</p>
          </div>
        )}
      </div>
      {/* <ChatbotButton onClick={() => navigate('/chatbot')} /> */}
    </main>
  );
};

export default MyPage; 