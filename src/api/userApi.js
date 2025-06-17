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