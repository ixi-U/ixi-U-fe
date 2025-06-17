import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_HOST || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 회원 탈퇴 요청
export const deleteUser = async () => {
  return client.delete('/api/user');
};

// 내 요금제 정보 조회
export const getMyPlan = async () => {
  const res = await client.get('/api/user/plan');
  return res.data; // { name, mobileDataLimitMb, monthlyPrice, pricePerKb, bundledBenefits, singleBenefits }
};

// 내 정보 조회 (id, name, email, userRole)
export const getMyInfo = async () => {
  const res = await client.get('/api/user/info');
  return res.data; // { id, name, email, userRole , createdAt}
}; 