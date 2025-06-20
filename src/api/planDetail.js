import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 올바른 함수 선언
export const fetchPlanDetail = async (planId) => {
  try {
    const res = await client.get(`/plans/details/${planId}`);
    return res.data;
  } catch (error) {
    console.error('요금제 상세 정보 로딩 실패:', error);
    throw error;
  }
};
