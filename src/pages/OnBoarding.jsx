import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일 유효성 간단 검증
    if (!email || !email.includes("@")) {
      setErrorMessage("올바른 이메일을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/user/email", {
        method: "POST",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        navigate("/"); // 등록 후 홈 또는 요금제 페이지로 이동
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "이메일 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("이메일 등록 중 오류:", error);
      setErrorMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}
    >
      <h2>이메일 등록</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          제출
        </button>
      </form>
      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
      )}
    </div>
  );
};

export default Onboarding;
