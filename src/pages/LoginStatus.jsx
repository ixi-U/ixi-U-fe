// MyPlan.tsx
import React, { useEffect, useState } from "react";

const LoginStatus = () => {
  const [plan, setPlan] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/me", {
          credentials: "include", // 쿠키 포함
        });

        const text = await response.text();
        try {
          const json = JSON.parse(text); // 응답이 JSON일 경우
          setPlan(json);
        } catch (e) {
          setMessage(text); // 응답이 문자열일 경우 (e.g. "아직 등록된 요금제가 없습니다.")
        }
      } catch (error) {
        console.error("요금제 조회 실패:", error);
        setMessage("요금제 조회에 실패했습니다.");
      }
    };

    fetchPlan();
  }, []);

  if (message) return <div>{message}</div>;

  return (
    <div>
      <h2>나의 요금제</h2>
      {plan && (
        <div>
          <p>요금제 이름: {plan.name}</p>
          <p>요금제 상태: {plan.state}</p>
        </div>
      )}
    </div>
  );
};

export default LoginStatus;
