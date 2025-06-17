import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const fetchPlans = async ({
  size = 10,
  planType,
  sortOption,
  searchKeyword,
  planId,
  cursorSortValue,
}) => {
  const res = await client.get('/plans', {
    params: {
      size,
      planTypeStr: planType,
      planSortOptionStr: sortOption,
      searchKeyword,
      planId,
      cursorSortValue,
    },
  });
  return res.data;
};

export const fetchPlanHistory = async () => {
  const res = await client.get(`/subscribed/history`);
  return res.data; // [{subscribedId, planName, subscribedAt}]
};