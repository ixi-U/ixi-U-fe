import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';

const LoginStatus = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [plan, setPlan] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || isLoading) return;
    const fetchPlan = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE}/api/user/info`,
          {
            credentials: "include", // 쿠키 포함
          }
        );

        const text = await response.text();
        try {
          const json = JSON.parse(text); // 응답이 JSON일 경우
          navigate("/plans");
        } catch (e) {
          if (text === "사용자 정보를 찾을 수 없습니다.") {
            navigate("/onboarding");
          } else {
            setMessage(text);
          }
        }
      } catch (error) {
        console.error("요금제 조회 실패:", error);
        setMessage("요금제 조회에 실패했습니다.");
      }
    };
    fetchPlan();
  }, [navigate, isLoggedIn, isLoading]);

  if (isLoading) return <div>로그인 상태 확인 중...</div>;
  if (!isLoggedIn) return <div style={{padding:40, textAlign:'center'}}>로그인 후 이용 가능한 서비스입니다.<br/><a href="/login">로그인하러 가기</a></div>;
  if (message) return <div>{message}</div>;

  return (
    <div>
      <h2>요금제 목록 페이지 이동중 ...</h2>
    </div>
  );
};

export default LoginStatus;
