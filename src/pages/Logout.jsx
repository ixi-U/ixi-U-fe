// src/components/Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Logout.css";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include", // 쿠키 포함
      });

      // 로컬 또는 세션 스토리지 제거 (로그인 여부 확인 시 사용된다면)
      localStorage.removeItem("access_token");

      navigate("/"); // 로그인 화면으로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      로그아웃
    </button>
  );
};

export default Logout;
