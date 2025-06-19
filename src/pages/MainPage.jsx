import React from "react";
import "./Main.css";
import centerLogo from "../assets/imgs/ixi-u2.png";
import Header from "../components/header/Header";

const services = [
  { id: 1, name: "5G 요금제", icon: "🚀", description: "최신 5G 기술로 빠른 속도" },
  { id: 2, name: "가족 요금제", icon: "👨‍👩‍👧‍👦", description: "가족 구성원 할인 혜택" },
  { id: 3, name: "데이터 쉐어링", icon: "📱", description: "데이터를 효율적으로 공유" },
  { id: 4, name: "부가서비스", icon: "🎵", description: "다양한 부가서비스 제공" },
  { id: 5, name: "해외 로밍", icon: "🌏", description: "전 세계 어디서나 데이터와 통화" },
  { id: 6, name: "멤버십 혜택", icon: "🎁", description: "다양한 제휴 멤버십 할인 제공" }
];

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

        {/* 서비스 섹션 */}
      <section className="services-section">
        <div className="main-container">
          <h2 className="section-title">주요 서비스</h2>
          <div className="services-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>

    </main>
  );
}