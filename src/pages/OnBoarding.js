import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OnBoarding = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 이메일을 백엔드로 전송
      await axios.post("http://localhost:8080/api/users/email", {
        email,
      });

      // 성공 시 메인 페이지로 이동
      navigate("/mainPage");
    } catch (error) {
      console.error("이메일 전송 실패", error);
      alert("이메일 전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>이메일 입력</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="이메일을 입력해주세요"
          required
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <br />
        <button
          type="submit"
          style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
        >
          제출
        </button>
      </form>
    </div>
  );
};

export default OnBoarding;
