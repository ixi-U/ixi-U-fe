import React from "react";
import KakaoLoginBtn from "../assets/kakao-login.png";

const Login = () => {
  const handleLogin = () => {
    const kakaoAuthUrl = `http://localhost:8080/oauth2/authorization/kakao`;
    if (!window.location.href.includes("code=")) {
      window.location.href = kakaoAuthUrl;
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>카카오 로그인</h1>
      <img
        src={KakaoLoginBtn}
        alt="카카오 로그인 버튼"
        style={{ cursor: "pointer" }}
        onClick={handleLogin}
      />
    </div>
  );
};

export default Login;
