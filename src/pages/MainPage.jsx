import React from "react";
import Header from "../components/header/Header";
import "../assets/styles/layout.css";

const MainPage = () => {
  return (
    <>
      <main className="container">
          <Header />
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>🎉 로그인 성공!</h1>
            <h2>여기는 메인페이지!</h2>
          </div>
      </main>
    </>
  );
};

export default MainPage;
