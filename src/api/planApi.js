import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const fetchPlans = async ({
  size = 20,
  planTypeStr,
  planSortOptionStr,
  searchKeyword,
  planId,
  cursorSortValue,
}) => {
  const res = await client.get(`/plans`, {
    params: {
      size,
      planTypeStr,
      planSortOptionStr,
      searchKeyword,
      planId,
      cursorSortValue,
    },
    withCredentials: true,
  });
  return res.data;
};

export const fetchPlanHistory = async () => {
  const res = await client.get(`/subscribed/history`);
  return res.data; // [{subscribedId, planName, subscribedAt}]
};


export const fetchPlanCount = async () => {
  const res = await client.get(`/plans/count`);
  return res.data;
};