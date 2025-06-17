import React, { useEffect, useState } from "react";

const Logout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: 로딩 중

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/user/me", {
          credentials: "include",
        });
        setIsAuthenticated(res.ok);
      } catch (e) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    if (!isAuthenticated) {
      alert("현재 로그아웃 상태입니다.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        alert("로그아웃 되었습니다.");
        window.location.href = "/plans"; // PlanListPage로 이동
      } else {
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    } catch (error) {
      alert("네트워크 오류로 로그아웃 실패");
    }
  };

  if (isAuthenticated === null) {
    return <p>로그인 상태 확인 중...</p>; // 로딩 중 표시
  }

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default Logout;
