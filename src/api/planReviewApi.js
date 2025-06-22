import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const fetchReviews = async (planId, page = 0, size = 5, sort = 'createdAt,desc') => {
  const res = await client.get('/api/reviews', {
    params: {
      planId,
      page,
      size,
      sort,
    },
  });
  return res.data;
};

export const fetchReviewStats = async (planId) => {
  const res = await client.get('/api/reviews/summary', {
    params: { planId },
  });
  return res.data;
};

export const createReview = async (planId, point, comment) => {
  const res = await client.post('/api/reviews', {
    planId,
    point,
    comment
  });
  return res.data;
};

export const updateReview = async (reviewId, comment) => {
  const res = await client.patch('/api/reviews', {
    reviewId,
    comment
  });
  return res.data;
};

export const deleteReview = async (reviewId) => {
  const res = await client.delete(`/api/reviews/${reviewId}`);
  return res.data;
};

export const createReport = async (reviewId) => {
  const res = await client.post('/api/reports', {
    reviewId
  });
  return res.data;
};

export const fetchReportedReviews = async (page = 0, size = 10) => {
  const res = await client.get('/api/reports', {
    params: {
      page,
      size,
    },
  });
  return res.data;
};
