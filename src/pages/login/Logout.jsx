import React, { useEffect, useState } from "react";
import useAuth from '../../hooks/useAuth';

const Logout = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const SERVER_URL = process.env.REACT_APP_API_BASE;

  const handleLogout = async () => {
    if (!isLoggedIn) {
      alert("현재 로그아웃 상태입니다.");
      return;
    }
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        alert("로그아웃 되었습니다.");
        window.location.href = "/plans";
      } else {
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    } catch (error) {
      alert("네트워크 오류로 로그아웃 실패");
    }
  };

  if (isLoading) {
    return <p>로그인 상태 확인 중...</p>;
  }

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default Logout;
