import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const isSuccess = query.get("success");

    if (isSuccess === "true") {
      console.log("로그인 성공");
      navigate("/mainPage"); // 메인 페이지 이동
    } else {
      alert("로그인 실패");
      navigate("/"); // 로그인 페이지 이동
    }
  }, [location, navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default LoginStatus;
