import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_HOST || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
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
  const res = await client.get('/api/reviews/stats', {
    params: { planId },
  });
  return res.data;
};
