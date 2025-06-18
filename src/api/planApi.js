import axios from "axios";

const client = axios.create({
<<<<<<< HEAD
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
=======
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
>>>>>>> origin/dev
});

export const fetchPlans = async ({
  size = 10,
  planType,
  sortOption,
  searchKeyword,
  planId,
  cursorSortValue,
}) => {
  const res = await client.get("/plans", {
    params: {
      size,
      planTypeStr: planType,
      planSortOptionStr: sortOption,
      searchKeyword,
      planId,
      cursorSortValue,
    },
    withCredentials: true,
  });
  return res.data;
};
<<<<<<< HEAD
=======

export const fetchPlanHistory = async () => {
  const res = await client.get(`/subscribed/history`);
  return res.data; // [{subscribedId, planName, subscribedAt}]
};
>>>>>>> origin/dev
