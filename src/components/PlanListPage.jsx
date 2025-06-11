import React, { useEffect, useState, useCallback, useRef } from 'react';
import logoImg from '../assets/ixi-u.png';
import { useNavigate } from 'react-router-dom';
import { fetchPlans } from '../api/planApi';
import { PLAN_TYPES, SORT_OPTIONS } from '../constants/planOptions';
import PlanCard from './PlanCard';
import SortDropDown from './SortDropdown';
import './PlanListPage.css';

export default function PlanListPage() {
  const [activeTab, setActiveTab] = useState('모바일'); // 모바일 / 마이데이터
  const [planType, setPlanType] = useState('5G/LTE');
  const [sortOption, setSortOption] = useState('PRIORITY');
  const [plans, setPlans] = useState([]);
  // Pagination state
  const [lastCursor, setLastCursor] = useState({ planId: null, sortValue: null });
  const [hasNext, setHasNext] = useState(false);
  const [keyword, setKeyword] = useState('');

  // sentinel ref for infinite scroll
  const sentinelRef = useRef(null);

  const navigate = useNavigate();

  const loadPlans = useCallback(
    async (cursor = null, isNext = false) => {
      const query = {
        size: 2,
        planType,
        sortOption,
        searchKeyword: keyword,
      };

      if (isNext && cursor?.planId != null && cursor.sortValue != null) {
        query.planId = cursor.planId;
        query.cursorSortValue = cursor.sortValue;
      }

      const data = await fetchPlans(query);

      setPlans(prev =>
        isNext ? [...prev, ...data.plans.content] : data.plans.content
      );
      setLastCursor({
        planId: data.lastPlanId,
        sortValue: data.lastSortValue,
      });
      setHasNext(data.plans.last === false);
    },
    [planType, sortOption, keyword]
  );

  useEffect(() => {
    // reset when filters change
    loadPlans(null, false);
  }, [planType, sortOption, keyword, loadPlans]);

  // 무한 스크롤: sentinel 이 화면에 보이면 다음 페이지 로드
  useEffect(() => {
    if (!hasNext) return;            // 더 불러올 게 없으면 관찰하지 않음
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPlans(lastCursor, true);
        }
      },
      { threshold: 1 }
    );
    const current = sentinelRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasNext, lastCursor, loadPlans]);

  return (
    <main className="plan-page">
      {/* 상단 바: 로고 | 탭 메뉴 | 로그인 */}
      <header className="service-header">
        {/* 좌측 로고 */}
        <img src={logoImg} alt="ixi-U logo" className="logo" />

        {/* 가운데 메뉴 */}
        <nav className="service-tabs">
          {['모바일', '마이페이지'].map(
            (tab) => (
              <button
                key={tab}
                className={tab === activeTab ? 'tab active' : 'tab'}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </nav>

        {/* 우측 로그인 */}
        <button className="login-btn" onClick={() => navigate('/')}>
          로그인
        </button>
      </header>

      {/* 회색 로그인 안내 영역 */}
      <section className="login-banner">
        <span>로그인하고 현재 가입 조건으로 이용하세요.</span>
        <button>로그인하기</button>
      </section>

      {/* 플랜 종류 네비게이션 */}
      <ul className="plan-type-nav">
        {PLAN_TYPES.map(pt => (
          <li
            key={pt.value}
            className={pt.value === planType ? 'active' : ''}
            onClick={() => setPlanType(pt.value)}
          >
            {pt.label}
          </li>
        ))}
      </ul>

      {/* 검색어 입력 + 정렬 */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="검색어"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="sort-bar">
          <SortDropDown
            options={SORT_OPTIONS}
            selected={sortOption}
            onChange={setSortOption}
          />
        </div>
      </div>

      {/* 카드 리스트 */}
      <section className="card-list">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}

        {/* 추가 데이터 로드 sentinel */}
        {hasNext && <div ref={sentinelRef} style={{ height: 1 }} />}

        {/* 더 이상 데이터가 없을 때 메시지 */}
        {!hasNext && plans.length > 0 && (
          <p className="no-more">더 조회할 수 있는 요금제가 없습니다!</p>
        )}
      </section>
    </main>
  );
}