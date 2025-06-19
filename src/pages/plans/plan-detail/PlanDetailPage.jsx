import React, { useEffect, useState, useCallback } from "react";
import "./PlanDetailPage.css";
import {
  fetchReviews,
  fetchReviewStats,
  deleteReview,
} from "../../../api/planReviewApi";
import ReviewModal from "./ReviewModal";
import Header from "../../../components/header/Header";
import { fetchPlanDetail } from "../../../api/planDetail";
import { useParams } from "react-router-dom";
import './PlanDetailPage.css';
import useAuth from '../../../hooks/useAuth';

const sortOptions = [
  { label: "최신순", value: "createdAt,desc" },
  { label: "평점 높은순", value: "point,desc" },
  { label: "평점 낮은순", value: "point,asc" },
];

const PlanDetailPage = () => {
  const { planId } = useParams();


  const [planData, setPlanData] = useState(null);
  const [planError, setPlanError] = useState(null);
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avg: 0, count: 0 });
  const [myReview, setMyReview] = useState(null);
  const [sort, setSort] = useState("createdAt,desc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    const loadPlanDetail = async () => {
      try {
        const response = await fetchPlanDetail(planId);
        setPlanData(response);
      } catch (err) {
        console.error("요금제 상세 정보 로딩 실패:", err);
        setPlanError("요금제 정보를 불러오지 못했습니다.");
      } finally {
      }
    };
    loadPlanDetail();
  }, [planId]);

  // 리뷰 데이터 로드 함수를 useCallback으로 메모이제이션
  const loadReviews = useCallback(
    async (pageNum = 0, sortValue = sort) => {
      try {
        setIsLoading(true);
        setError(null);

        // 리뷰 통계 가져오기
        const statsData = await fetchReviewStats(planId);
        console.log("리뷰 통계:", statsData);

        // 통계 정보 설정
        const stats = statsData.showReviewStatsResponse;
        setReviewStats({
          avg: stats.averagePoint || 0,
          count: stats.totalCount || 0,
        });

        // 내가 작성한 리뷰가 있는 경우에만 설정
        if (statsData.myReviewResponse) {
          setMyReview(statsData.myReviewResponse);
        } else {
          setMyReview(null);
        }

        // 리뷰 목록 가져오기
        const data = await fetchReviews(planId, pageNum, 5, sortValue);
        console.log("리뷰 목록:", data);

        // API 응답 구조에 맞게 데이터 설정
        const reviewsData = data.reviewResponseList || [];
        console.log("설정할 리뷰 데이터:", reviewsData);

        setReviews((prev) =>
          pageNum === 0 ? reviewsData : [...prev, ...reviewsData]
        );
        setHasMore(data.hasNextPage);
        setPage(pageNum);
      } catch (err) {
        console.error("리뷰 로드 실패:", err);
        setError("리뷰를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
        setReviews([]);
        setReviewStats({ avg: 0, count: 0 });
        setMyReview(null);
      } finally {
        setIsLoading(false);
      }
    },
    [planId, sort]
  );

  // 초기 로드
  useEffect(() => {
    loadReviews(0, sort);
  }, [loadReviews, sort]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setShowSortMenu(false);
  };

  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadReviews(page + 1);
    }
  };

  // 재시도 핸들러
  const handleRetry = () => {
    loadReviews(0, sort);
  };

  const handleReviewCreated = () => {
    loadReviews(0, sort); // 리뷰 목록 새로고침
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (reviewId) => {
    if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      try {
        await deleteReview(reviewId);
        loadReviews(0, sort); // 리뷰 목록 새로고침
      } catch (err) {
        console.error("리뷰 삭제 실패:", err);
        alert(err.response?.data?.message || "리뷰 삭제에 실패했습니다.");
      }
    }
  };

  const handleReviewUpdated = () => {
    loadReviews(0, sort); // 리뷰 목록 새로고침
  };

  if(!planData && !planError) {
    return (
      <div className="plan-page">
        <Header />
        <div className="loading-container">
          <div className="loading">요금제 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (planError) {
    return (
      <div className="plan-page">
        <Header />
        <div className="error-container">
          <div className="error">{planError}</div>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-page">
      <Header />

      {/* 로그인 안내 배너 */}
      {!authLoading && !isLoggedIn && (
        <div className="login-banner">
          <span>로그인하고 더 많은 혜택을 확인하세요!</span>
          <button onClick={() => window.location.href = '/login'}>로그인하기</button>
        </div>
      )}

      <ul className="plan-type-nav">
        <li className="active">전체</li>
        <li>5G 요금제</li>
        <li>LTE 요금제</li>
        <li>청소년 요금제</li>
        <li>시니어 요금제</li>
      </ul>

      <div className="plan-title">
        <h1>{planData.name}</h1>
        <p className="monthly-price">
          <span>월</span> {planData.monthlyPrice.toLocaleString()}원
        </p>
      </div>

      <section className="service-section">
        <div className="service-grid">
          <div className="service-card">
            <div className="service-icon">📱</div>
            <div className="service-name">데이터</div>
            <div className="service-value">
              {planData.mobileDataLimitMb === -1
                ? "무제한"
                : `${Math.round(planData.mobileDataLimitMb / 1024)} GB`}
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">🔄</div>
            <div className="service-name">테더링/공유</div>
            <div className="service-value">
              {planData.sharedMobileDataLimitMb === -1
                ? "무제한"
                : `${Math.round(planData.sharedMobileDataLimitMb / 1024)} GB`}
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">📞</div>
            <div className="service-name">음성통화</div>
            <div className="service-value">
              {planData.callLimitMinutes === -1
                ? "무제한"
                : `${planData.callLimitMinutes}분`}
            </div>
          </div>
          <div className="service-card">
            <div className="service-icon">✉️</div>
            <div className="service-name">문자</div>
            <div className="service-value">
              {planData.messageLimit === -1
                ? "무제한"
                : `${planData.messageLimit}건`}
            </div>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <h2 className="section-title">묶음 혜택</h2>
        <div className="benefits-grid">
          {planData.bundledBenefits?.flatMap((group, groupIndex) =>
            group.singleBenefits.map((benefit, index) => (
              <div key={`${groupIndex}-${index}`} className="benefit-card">
                <span className="benefit-tag">{benefit.benefitType}</span>
                <h3 className="benefit-title">{benefit.name}</h3>
                <p className="benefit-desc">{benefit.description}</p>
              </div>
            ))
          )}
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
          {planData.etcInfo?.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="review-section">
        <div className="review-header">
          <span className="review-title">리뷰</span>
          <span className="review-star">
            ⭐ <b>{(reviewStats?.avg || 0).toFixed(1)}</b>
          </span>
          <span className="review-count">{reviewStats?.count || 0}개</span>
          <div className="review-controls">
            <div className="review-sort">
              <button
                className="review-sort-btn"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                {sortOptions.find((opt) => opt.value === sort)?.label ||
                  "최신순"}{" "}
                ▼
              </button>
              {showSortMenu && (
                <ul className="sort-menu">
                  {sortOptions.map((option) => (
                    <li
                      key={option.value}
                      className={option.value === sort ? "active" : ""}
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              className="write-review-btn"
              onClick={() => setIsReviewModalOpen(true)}
            >
              리뷰 작성
            </button>
          </div>
        </div>
        <div className="review-list">
          {error && (
            <div className="review-error">
              <p>{error}</p>
              <button className="retry-btn" onClick={handleRetry}>
                다시 시도
              </button>
            </div>
          )}
          {!error && myReview && (
            <div className="my-review">
              <h3>내가 작성한 리뷰</h3>
              <div className="review-item">
                <div className="review-header-row">
                  <div className="review-meta">
                    <span className="review-nickname">
                      {myReview.userName || "익명"}
                    </span>
                    <span className="review-point">
                      {"★".repeat(myReview.point)}
                      {"☆".repeat(5 - myReview.point)}
                    </span>
                    <span className="review-date">
                      {myReview.createdAt?.slice(0, 10)}
                    </span>
                  </div>
                  <div className="review-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(myReview)}
                    >
                      수정
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(myReview.reviewId)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="review-content">{myReview.comment}</div>
              </div>
            </div>
          )}
          {!error &&
            (!Array.isArray(reviews) || reviews.length === 0) &&
            !isLoading && <div className="review-empty">리뷰가 없습니다.</div>}
          {!error &&
            Array.isArray(reviews) &&
            reviews.map((r, idx) => {
              console.log("렌더링할 리뷰:", r);
              return (
                <div className="review-item" key={r.reviewId || idx}>
                  <div className="review-header-row">
                    <div className="review-meta">
                      <span className="review-nickname">
                        {r.userName || "익명"}
                      </span>
                      <span className="review-point">
                        {"★".repeat(r.point)}
                        {"☆".repeat(5 - r.point)}
                      </span>
                      <span className="review-date">
                        {r.createdAt?.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                  <div className="review-content">{r.comment}</div>
                </div>
              );
            })}
          {isLoading && <div className="review-loading">로딩 중...</div>}
          {!error && hasMore && !isLoading && (
            <button className="load-more-btn" onClick={handleLoadMore}>
              더보기
            </button>
          )}
        </div>
      </section>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        planId={planId}
        onReviewCreated={handleReviewCreated}
      />

      {editingReview && (
        <ReviewModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingReview(null);
          }}
          planId={planId}
          onReviewCreated={handleReviewUpdated}
          isEdit={true}
          review={editingReview}
        />
      )}
    </div>
  );
};

export default PlanDetailPage;
