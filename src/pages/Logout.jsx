import React from "react";

const Logout = () => {
  const handleLogout = async () => {
    await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include", // 쿠키 포함
    });

    window.location.href = "/"; // login 화면으로 이동
  };

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default Logout;
