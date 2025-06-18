import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const fetchPlanDetail = async (planId) => {
    const res = await client.get(`/api/plans/${planId}`);

    return res.data;
}