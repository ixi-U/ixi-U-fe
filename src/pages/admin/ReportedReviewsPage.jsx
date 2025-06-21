import React, { useEffect, useState, useCallback } from "react";
import "./ReportedReviewsPage.css";
import { fetchReportedReviews } from "../../api/planReviewApi";
import Header from "../../components/header/Header";

const ReportedReviewsPage = () => {
  const [reportedReviews, setReportedReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReportedReviews = useCallback(async (pageNum = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchReportedReviews(pageNum, 10);
      console.log("신고된 리뷰 목록:", data);

      const reviewsData = data.reviewResponseList || [];
      console.log("설정할 신고된 리뷰 데이터:", reviewsData);

      setReportedReviews((prev) =>
        pageNum === 0 ? reviewsData : [...prev, ...reviewsData]
      );
      setHasMore(data.hasNextPage);
      setPage(pageNum);
    } catch (err) {
      console.error("신고된 리뷰 로드 실패:", err);
      setError("신고된 리뷰를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
      setReportedReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadReportedReviews(0);
  }, [loadReportedReviews]);

  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadReportedReviews(page + 1);
    }
  };

  // 재시도 핸들러
  const handleRetry = () => {
    loadReportedReviews(0);
  };

  return (
    <div className="reported-reviews-page">
      <Header />
      
      <div className="reported-reviews-container">
        <div className="page-header">
          <h1>신고된 리뷰 관리</h1>
          <p>사용자들이 신고한 부적절한 리뷰들을 확인하고 관리할 수 있습니다.</p>
        </div>

        <div className="reported-reviews-content">
          {error && (
            <div className="error-container">
              <p>{error}</p>
              <button className="retry-btn" onClick={handleRetry}>
                다시 시도
              </button>
            </div>
          )}

          {!error && reportedReviews.length === 0 && !isLoading && (
            <div className="empty-container">
              <p>신고된 리뷰가 없습니다.</p>
            </div>
          )}

          {!error && reportedReviews.length > 0 && (
            <div className="reported-reviews-list">
              {reportedReviews.map((review, index) => (
                <div className="reported-review-item" key={review.reviewId || index}>
                  <div className="review-header">
                    <div className="review-meta">
                      <span className="review-id">리뷰 ID: {review.reviewId}</span>
                      <span className="review-user">작성자: {review.userName || "익명"}</span>
                      <span className="review-date">
                        {review.createdAt?.slice(0, 10)}
                      </span>
                    </div>
                    <div className="review-rating">
                      평점: {"★".repeat(review.point)}
                      {"☆".repeat(5 - review.point)}
                    </div>
                  </div>
                  <div className="review-content">
                    <h4>리뷰 내용:</h4>
                    <p>{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="loading-container">
              <p>로딩 중...</p>
            </div>
          )}

          {!error && hasMore && !isLoading && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={handleLoadMore}>
                더보기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportedReviewsPage; 