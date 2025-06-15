import React, { useEffect, useState } from 'react';
import './PlanDetailPage.css';
import { useLocation } from 'react-router-dom';
import logoImg from '../assets/ixi-u.png';

// 더미 리뷰 데이터
const dummyReviews = [
  {
    userName: "홍길동",
    point: 5,
    comment: "정말 만족스러운 요금제예요. 속도도 빠르고 혜택도 많아요!",
    createdAt: "2024-06-10T12:34:56"
  },
  {
    userName: "김철수",
    point: 3,
    comment: "괜찮긴 한데 가격이 조금 아쉬워요.",
    createdAt: "2024-06-09T08:21:10"
  },
  {
    userName: null,
    point: 4,
    comment: "혜택이 다양해서 좋네요. 추천합니다.",
    createdAt: "2024-06-08T14:00:00"
  }
];

const sortOptions = [
  { label: '최신순', value: 'createdAt,desc' },
  { label: '평점 높은순', value: 'point,desc' },
  { label: '평점 낮은순', value: 'point,asc' }
];

const PlanDetailPage = () => {
  const location = useLocation();
  const planId = location.pathname.split('/').pop();

  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avg: 0, count: 0 });
  const [sort, setSort] = useState('createdAt,desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [planData] = useState({
    name: "5G 프리미어 레귤러",
    mobileDataLimitMb: 2147483647,
    sharedMobileDataLimitMb: 81920,
    callLimitMinutes: 2147483647,
    messageLimit: 2147483647,
    monthlyPrice: 61000,
    planType: "FIVE_G_LTE",
    usageCautions: null,
    mobileDataThrottleSpeedKbps: -1,
    minAge: 19,
    maxAge: 150,
    pricePerKb: -1,
    etcInfo: "[데이터]\n- 네트워크 환경에 따라 속도가 일시적으로 느려질 수 있어요.\n- 데이터를 이용한 음성/영상통화는 데이터 제공량을 다 쓰고 속도 제어 상태가 되어도 이용할 수 있어요.",
    bundledBenefits: [
      {
        name: "미디어 서비스 기본 제공",
        description: "월정액 95,000원 이상 카테고리팩 요금제 고객님들만 이용할 수 있는 특별 혜택이에요.",
        singleBenefits: [
          { name: "유플레이", description: "최신 영화, OTT 오리지널 콘텐츠 등 8만여 편의 콘텐츠를 볼 수 있는 서비스", benefitType: "구독" },
          { name: "밀리의 서재", description: "독서 컨텐츠를 언제 어디서나 무제한으로 즐길 수 있는 국내 최대 독서 플랫폼 서비스", benefitType: "구독" },
          { name: "지니뮤직 300회 음악감상", description: "지니뮤직 앱과 홈페이지에서 좋아하는 음악을 월 300회 감상할 수 있는 서비스", benefitType: "구독" }
        ]
      }
    ],
    singleBenefits: [
      { name: "현역 병사 혜택", description: "복무 기간 동안 매달 요금을 20% 할인 받을 수 있어요.", benefitType: "할인" },
      { name: "U+ 투게더 결합", description: "가족과 결합하면 데이터 무제한 요금제를 최대 20,000원 저렴하게 이용할 수 있어요.", benefitType: "할인" },
      { name: "U+멤버십 VIP 등급 혜택", description: "가입 한 달 후 바로 VIP 혜택 이용 가능", benefitType: "구독" }
    ]
  });

  // 리뷰 초기화
  useEffect(() => {
    const total = dummyReviews.length;
    const avg = total === 0 ? 0 : dummyReviews.reduce((sum, r) => sum + r.point, 0) / total;
    setReviewStats({ avg, count: total });
    sortAndSetReviews(sort);
  }, []);

  const sortAndSetReviews = (sortValue) => {
    const sorted = [...dummyReviews];
    if (sortValue === 'point,desc') sorted.sort((a, b) => b.point - a.point);
    else if (sortValue === 'point,asc') sorted.sort((a, b) => a.point - b.point);
    else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setReviews(sorted);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    sortAndSetReviews(newSort);
    setShowSortMenu(false);
  };

  return (
    <div className="plan-page">
      <header className="service-header">
        <div className="brand">
          <img src={logoImg} alt="LG U+ Logo" className="logo" />
        </div>
        <div className="tabs-row">
          <nav className="service-tabs">
            <button className="tab active">요금제</button>
            <button className="tab">휴대폰</button>
            <button className="tab">액세서리</button>
          </nav>
          <button className="login-btn">로그인</button>
        </div>
      </header>

      <div className="login-banner">
        <span>로그인하고 더 많은 혜택을 확인하세요!</span>
        <button>로그인하기</button>
      </div>

      <ul className="plan-type-nav">
        <li className="active">전체</li>
        <li>5G 요금제</li>
        <li>LTE 요금제</li>
        <li>청소년 요금제</li>
        <li>시니어 요금제</li>
      </ul>

      <div className="plan-title">
        <h1>{planData.name}</h1>
        <p className="monthly-price"><span>월</span> {planData.monthlyPrice.toLocaleString()}원</p>
      </div>

      <section className="service-section">
        <div className="service-grid">
          <div className="service-card"><div className="service-icon">📱</div><div className="service-name">데이터</div><div className="service-value">무제한</div></div>
          <div className="service-card"><div className="service-icon">🔄</div><div className="service-name">테더링/공유</div><div className="service-value">{Math.floor(planData.sharedMobileDataLimitMb / 1024)}GB</div></div>
          <div className="service-card"><div className="service-icon">📞</div><div className="service-name">음성통화</div><div className="service-value">무제한</div></div>
          <div className="service-card"><div className="service-icon">✉️</div><div className="service-name">문자</div><div className="service-value">무제한</div></div>
        </div>
      </section>

      <section className="benefits-section">
        <h2 className="section-title">미디어 서비스</h2>
        <div className="benefits-grid">
          {planData.bundledBenefits[0].singleBenefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <span className="benefit-tag">{benefit.benefitType}</span>
              <h3 className="benefit-title">{benefit.name}</h3>
              <p className="benefit-desc">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <h2 className="section-title">기본 혜택</h2>
        <div className="benefits-grid">
          {planData.singleBenefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <span className="benefit-tag">{benefit.benefitType}</span>
              <h3 className="benefit-title">{benefit.name}</h3>
              <p className="benefit-desc">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <h2 className="section-title">이용 안내</h2>
        <div className="info-content">
          {planData.etcInfo.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="review-section">
        <div className="review-header">
          <span className="review-title">리뷰</span>
          <span className="review-star">⭐ <b>{reviewStats.avg.toFixed(1)}</b></span>
          <span className="review-count">{reviewStats.count}개</span>
          <div className="review-sort">
            <button className="review-sort-btn" onClick={() => setShowSortMenu(!showSortMenu)}>
              {sortOptions.find(opt => opt.value === sort)?.label || '최신순'} ▼
            </button>
            {showSortMenu && (
              <ul className="sort-menu">
                {sortOptions.map(option => (
                  <li key={option.value} className={option.value === sort ? 'active' : ''} onClick={() => handleSortChange(option.value)}>
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="review-list">
          {reviews.length === 0 && <div className="review-empty">리뷰가 없습니다.</div>}
          {reviews.map((r, idx) => (
            <div className="review-item" key={idx}>
              <div className="review-meta">
                <span className="review-nickname">{r.userName || '익명'}</span>
                <span className="review-point">{'★'.repeat(r.point)}{'☆'.repeat(5 - r.point)}</span>
                <span className="review-date">{r.createdAt?.slice(0, 10)}</span>
              </div>
              <div className="review-content">{r.comment}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PlanDetailPage;
