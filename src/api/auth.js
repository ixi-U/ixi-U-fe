import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// 예시: 사용자 정보 요청
export const fetchUserInfo = async () => {
  return await api.get("/api/users/me");
};
