import React from "react";
import "./Main.css";
import centerLogo from "../assets/imgs/ixi-u2.png";
import Header from "../components/header/Header";

export default function MainPage() {
  return (
    <main className="container">
      {/* 전역 헤더 */}
      <Header />
      <div className="main-wrapper">
        {/* 메인 히어로 영역 */}
        <section className="hero-section">
          <button className="nav-arrow left">❮</button>

          <div className="hero-content">
            <img src={centerLogo} alt="중앙 로고" className="hero-logo" />
            <p className="hero-text">
              U+의 다양한 요금제를
              <br />
              자신의 필요에 맞게 탐색하세요
            </p>
          </div>

          <button className="nav-arrow right">❯</button>
        </section>
      </div>

    </main>
  );
}