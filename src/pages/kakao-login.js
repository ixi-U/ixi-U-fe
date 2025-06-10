import React from "react";
import KakakoLoginBtn from "../assets/kakao-login.png";

const Login = () => {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  const handleLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl; // 사용자가 카카오 로그인 화면으로 이동
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>카카오 로그인</h1>
      <img
        src={KakakoLoginBtn}
        alt="카카오 로그인 버튼"
        style={{ cursor: "pointer" }}
        onClick={handleLogin}
      />
    </div>
  );
};

export default Login;
