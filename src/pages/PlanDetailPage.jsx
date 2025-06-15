import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/ixi-u.png';
import { fetchReviews, fetchReviewStats } from '../api/planReviewApi';
import './PlanDetailPage.css';

export default function PlanDetailPage() {
  const { planId } = useParams();
  const [activeTab, setActiveTab] = React.useState('모바일');
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avg: 0, count: 0 });
  const [sort, setSort] = useState('createdAt,desc');
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sentinelRef = useRef(null);

  const sortOptions = [
    { label: '최신순', value: 'createdAt,desc' },
    { label: '평점 높은순', value: 'point,desc' },
    { label: '평점 낮은순', value: 'point,asc' }
  ];

  const plan = {
    id: planId,
    name: '요금제 이름',
    monthlyPrice: 85000,
    mobileData: '데이터 정보',
    sharedData: '공유 데이터',
    call: '음성통화',
    message: '문자메시지',
    benefit: '기본혜택',
    detail:
      '요금제 설명,요금제 설명,요금제 설명,요금제 설명,요금제 설명,요금제 설명,요금제 설명,요금제 설명,요금제 설명,요금제 설명',
  };

  // 리뷰 통계 불러오기
  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await fetchReviewStats(planId);
        setReviewStats({ avg: stats.averagePoint, count: stats.totalCount });
      } catch (e) {
        setReviewStats({ avg: 0, count: 0 });
      }
    }
    loadStats();
  }, [planId]);

  // 리뷰 불러오기
  const loadReviews = useCallback(async (reset = false) => {
    try {
      const data = await fetchReviews(planId, reset ? 0 : page, 5, sort);
      const newList = data.reviewResponseList || [];
      setReviews(prev => reset ? newList : [...prev, ...newList]);
      setHasNext(data.hasNextPage);
      if (reset) setPage(1);
      else setPage(p => p + 1);
    } catch (e) {
      if (reset) setReviews([]);
      setHasNext(false);
    }
  }, [planId, page, sort]);

  // 최초/정렬 변경 시 초기화
  useEffect(() => {
    setReviews([]);
    setPage(0);
    loadReviews(true);
    // eslint-disable-next-line
  }, [planId, sort]);

  // 무한 스크롤
  useEffect(() => {
    if (!hasNext) return;
    const observer = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadReviews();
      }
    }, { threshold: 1 });
    const current = sentinelRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, [hasNext, loadReviews]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setShowSortMenu(false);
  };

  return (
    <main className="plan-detail-page">
      <header className="service-header">
        <div className="service-header-left">
          <img src={logoImg} alt="ixi-U logo" className="logo" />
          <nav className="service-tabs">
            {['모바일', '마이페이지'].map((tab) => (
              <button
                key={tab}
                className={`tab ${tab === activeTab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="user-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="12" r="6" stroke="#222" strokeWidth="2" />
            <path d="M6 26c0-4 4.5-6 10-6s10 2 10 6" stroke="#222" strokeWidth="2" />
          </svg>
        </div>
      </header>

      <section className="plan-header-section">
        <div className="plan-header-inner">
          <div className="plan-header-left">
            <h1 className="plan-title">{plan.name}</h1>
            <div className="plan-info-cards">
              <div className="info-card">{plan.mobileData}</div>
              <div className="info-card">{plan.sharedData}</div>
              <div className="info-card">{plan.call}</div>
              <div className="info-card">{plan.message}</div>
              <div className="info-card">{plan.benefit}</div>
            </div>
          </div>
          <div className="plan-header-right">
            <div className="plan-price">월 <b>{plan.monthlyPrice.toLocaleString()}원</b></div>
            <div className="plan-header-actions">
              <button className="compare-btn">비교하기</button>
              <button className="change-btn">변경하기</button>
            </div>
          </div>
        </div>
      </section>

      <section className="plan-detail-section plan-detail-full">
        <h2 className="detail-title">요금제 상세 정보</h2>
        <div className="detail-desc">{plan.detail}</div>
      </section>

      {/* 리뷰 영역 */}
      <section className="review-section">
        <div className="review-header">
          <span className="review-title">리뷰</span>
          <span className="review-star">⭐ <b>{reviewStats.avg.toFixed(1)}</b></span>
          <span className="review-count">{reviewStats.count}개</span>
          <div className="review-sort">
            <button 
              className="review-sort-btn" 
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              {sortOptions.find(opt => opt.value === sort)?.label || '최신순'} ▼
            </button>
            {showSortMenu && (
              <ul className="sort-menu">
                {sortOptions.map(option => (
                  <li 
                    key={option.value}
                    className={option.value === sort ? 'active' : ''}
                    onClick={() => handleSortChange(option.value)}
                  >
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
          {hasNext && <div ref={sentinelRef} style={{ height: 1 }} />}
        </div>
      </section>
    </main>
  );
} 