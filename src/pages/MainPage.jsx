import React from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/imgs/ixi-u.png";
import centerLogo from "../assets/imgs/ixi-u2.png";
import "./Main.css";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <main className="main-wrapper">
      <header className="main-header">
        <img src={logoImg} alt="ixi-U logo" className="header-logo" />
        <nav className="header-tabs">
          {["모바일", "마이페이지"].map((tab) => (
            <button key={tab} className="tab-btn">
              {tab}
            </button>
          ))}
        </nav>
        <button className="login-outline" onClick={() => navigate("/")}>
          로그인
        </button>
      </header>

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
    </main>
  );
}
