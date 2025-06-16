import React, { useState, useEffect } from 'react';
import { createReview, updateReview } from '../api/planReviewApi';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, planId, onReviewCreated, isEdit = false, review = null }) => {
  const [point, setPoint] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && review) {
      setPoint(review.point);
      setComment(review.comment);
    } else {
      setPoint(0);
      setComment('');
    }
  }, [isEdit, review]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEdit) {
      // 새 리뷰 작성 시 유효성 검사
      if (point < 1 || point > 5) {
        setError('평점은 1점에서 5점 사이여야 합니다.');
        return;
      }
    }

    if (comment.length < 20 || comment.length > 200) {
      setError('리뷰 내용은 20자에서 200자 사이여야 합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEdit) {
        await updateReview(review.reviewId, comment);
      } else {
        await createReview(planId, point, comment);
      }
      onReviewCreated(); // 리뷰 목록 새로고침
      onClose(); // 모달 닫기
    } catch (err) {
      console.error('리뷰 처리 실패:', err);
      setError(err.response?.data?.message || '리뷰 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEdit ? '리뷰 수정' : '리뷰 작성'}</h2>
        <form onSubmit={handleSubmit}>
          {!isEdit && (
            <div className="rating-section">
              <label>평점</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= point ? 'active' : ''}`}
                    onClick={() => setPoint(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="comment-section">
            <label>리뷰 내용</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="리뷰 내용을 입력해주세요 (20자 이상 200자 이하)"
              rows="5"
            />
            <div className="character-count">
              {comment.length}/200
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-buttons">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              취소
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '처리 중...' : (isEdit ? '수정하기' : '작성하기')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal; 