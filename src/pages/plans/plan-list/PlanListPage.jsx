import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlans, fetchPlanCount } from "../../../api/planApi";
import { getMyPlan } from "../../../api/userApi";
import { PLAN_TYPES, SORT_OPTIONS } from "../../../constants/planOptions";
import PlanCard from "./PlanCard";
import SortDropDown from "./SortDropdown";
import "./PlanListPage.css";
import Header from "../../../components/header/Header";
import "../../../assets/styles/layout.css";
import useAuth from "../../../hooks/useAuth";
import { getMyInfo } from "../../../api/userApi";

// planCounts 키 매핑
const snakeToCamel = {
  "5G/LTE":       "fiveGLte",
  "ONLINE":           "online",
  "TABLET/SMARTWATCH":"tabletSmartwatch",
  "DUAL_NUMBER":      "dualNumber",
};

// 데이터 양을 포맷하는 헬퍼 함수
const formatData = (mb) => {
  if (mb === 2147483647) return "무제한"; // Java의 Integer.MAX_VALUE
  if (!mb) return "0MB";
  if (mb < 1024) return `${mb}MB`;
  const gb = (mb / 1024).toFixed(1);
  return `${gb.endsWith(".0") ? Math.floor(mb / 1024) : gb}GB`;
};

export default function PlanListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("모바일"); // 모바일 / 마이데이터
  // 기본으로 전체 요금제 조회
  const [planType, setPlanType] = useState();
  const [sortOption, setSortOption] = useState("PRIORITY");
  const [plans, setPlans] = useState([]);
  // Pagination state
  const [lastCursor, setLastCursor] = useState({
    planId: null,
    sortValue: null,
  });
  const [hasNext, setHasNext] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isPlanLoading, setIsPlanLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isPlansLoading, setIsPlansLoading] = useState(false);
  const [planCounts, setPlanCounts] = useState({
    all: 0,
    fiveGLte: 0,
    online: 0,
    tabletSmartwatch: 0,
    dualNumber: 0,
  });
  // sentinel ref for infinite scroll
  const sentinelRef = useRef(null);
  const { isLoggedIn, isLoading } = useAuth();

  const loadPlans = useCallback(
    async (cursor = null, isNext = false) => {
      try {
        if (!isNext) {
          setIsPlansLoading(true);
        }

        const query = {
          size: 20,
          planTypeStr: planType,
          planSortOptionStr: sortOption,
          searchKeyword: keyword,
        };

        if (isNext && cursor?.planId != null && cursor.sortValue != null) {
          query.planId = cursor.planId;
          query.cursorSortValue = cursor.sortValue;
        }
        console.log("[loadPlans] query →", query);

        const data = await fetchPlans(query);

        /* ====== 디버그용 출력 ====== */
        console.log("[loadPlans] response →", data);
        /* ========================= */

        // API 응답이 예상과 다를 때를 대비한 안전한 처리
        const plansContent = data?.plans || [];
        const lastPlanId = data?.lastPlanId || null;
        const lastSortValue = data?.lastSortValue || null;
        const isLast = !data?.hasNext;

        setPlans((prev) =>
          isNext ? [...prev, ...plansContent] : plansContent
        );
        setLastCursor({
          planId: lastPlanId,
          sortValue: lastSortValue,
        });
        setHasNext(!isLast);
      } catch (error) {
        console.error("Failed to load plans:", error);
        // 에러 발생 시 빈 배열로 설정
        setPlans([]);
        setHasNext(false);
      } finally {
        setIsPlansLoading(false);
      }
    },
    [planType, sortOption, keyword]
  );

  useEffect(() => {
    const loadPlanCounts = async () => {
      try {
        const data = await fetchPlanCount();
        setPlanCounts(data);
      } catch (err) {
        console.error("플랜 카운트 불러오기 실패", err);
      }
    };
    loadPlanCounts();
  }, []);

  // 초기 요금제 목록 로드
  useEffect(() => {
    loadPlans(null, false);
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  useEffect(() => {
    // reset when filters change
    loadPlans(null, false);
  }, [planType, sortOption, keyword, loadPlans]);

  // 무한 스크롤: sentinel 이 화면에 보이면 다음 페이지 로드
  useEffect(() => {
    if (!hasNext) return; // 더 불러올 게 없으면 관찰하지 않음
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

  useEffect(() => {
    if (isLoggedIn) {
      setIsPlanLoading(true);
      getMyPlan()
        .then((data) => {
          setCurrentPlan(data);
        })
        .catch((err) => {
          console.error("Failed to fetch current plan", err);
          setCurrentPlan(null); // 플랜이 없거나 에러 발생
        })
        .finally(() => {
          setIsPlanLoading(false);
        });
    } else {
      setIsPlanLoading(false);
      setCurrentPlan(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      getMyInfo()
        .then((data) => setUserRole(data.userRole))
        .catch(() => setUserRole(null));
    } else {
      setUserRole(null);
    }
  }, [isLoggedIn]);

  return (
    <main className="container">
      {/* 상단 바: 로고 | 탭 메뉴 | 로그인 */}
      <Header />

      {/* 로딩 상태에 따른 배너 렌더링 */}
      {isLoading || isPlanLoading ? (
        <section className="current-plan-banner loading">
          <span>사용자 정보를 확인하는 중...</span>
        </section>
      ) : isLoggedIn && currentPlan && userRole !== "ROLE_ADMIN" ? (
        <section className="current-plan-banner">
          <div className="plan-info-item">
            <span className="label">이용중인 요금제</span>
            <span className="value">{currentPlan.name}</span>
          </div>
          <div className="plan-info-item">
            <span className="label">월정액</span>
            <span className="value">
              월 {currentPlan?.monthlyPrice?.toLocaleString?.() ?? "정보 없음"}
              원
            </span>
          </div>
          <div className="plan-info-item">
            <span className="label">데이터</span>
            <span className="value">
              {formatData(currentPlan.mobileDataLimitMb)}
            </span>
          </div>
        </section>
      ) : (
        !isLoggedIn &&
        userRole !== "ROLE_ADMIN" && (
          <section className="login-banner">
            <span>로그인하고 현재 가입 조건으로 이용하세요.</span>
          </section>
        )
      )}

      {/* 플랜 종류 네비게이션 */}
      <ul className="plan-type-nav">
        <li
          className={planType == null ? "active" : ""}
          onClick={() => setPlanType(null)}
        >
          전체 ({planCounts.all ?? 0})
        </li>
        {PLAN_TYPES.map((pt) => {
          const key = snakeToCamel[pt.value];
          const count = planCounts[key] ?? 0;
          return (
            <li
              key={pt.value}
              className={pt.value === planType ? "active" : ""}
              onClick={() => setPlanType(pt.value)}
            >
              {pt.label} ({count})
            </li>
          );
        })}
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
        {isPlansLoading && !plans.length ? (
          <p className="loading-plans">요금제를 불러오는 중...</p>
        ) : plans && plans.length > 0 ? (
          plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
        ) : (
          <p className="no-plans">조회할 수 있는 요금제가 없습니다.</p>
        )}

        {/* 추가 데이터 로드 sentinel */}
        {hasNext && <div ref={sentinelRef} style={{ height: 1 }} />}

        {/* 더 이상 데이터가 없을 때 메시지 */}
        {!hasNext && plans && plans.length > 0 && (
          <p className="no-more">더 조회할 수 있는 요금제가 없습니다!</p>
        )}
      </section>
    </main>
  );
}
