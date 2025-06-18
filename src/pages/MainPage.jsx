import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import "./MainPage.css";
import screenshot1 from "../assets/스크린샷 2025-06-18 101248.png";
import screenshot2 from "../assets/스크린샷 2025-06-18 101310.png";
import screenshot3 from "../assets/스크린샷 2025-06-18 101319.png";

const MainPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    const token = document.cookie.includes('token=');
    setIsLoggedIn(token);

    // 배너 자동 슬라이드
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const banners = [
    {
      id: 1,
      image: screenshot1,
      buttonText: "서비스 가입하기",
      buttonStyle: { left: 60, bottom: 80, width: 180, height: 56 },
      buttonClass: "banner-pink-btn"
    },
    {
      id: 2,
      image: screenshot2,
      buttonText: "자세히 보기",
      buttonStyle: { left: 60, bottom: 80, width: 180, height: 56 },
      buttonClass: "banner-pink-btn"
    },
    {
      id: 3,
      image: screenshot3,
      buttonText: "자세히 보기",
      buttonStyle: { left: 60, bottom: 80, width: 180, height: 56 },
      buttonClass: "banner-pink-btn outline"
    }
  ];

  const services = [
    { id: 1, name: "5G 요금제", icon: "🚀", description: "최신 5G 기술로 빠른 속도" },
    { id: 2, name: "가족 요금제", icon: "👨‍👩‍👧‍👦", description: "가족 구성원 할인 혜택" },
    { id: 3, name: "데이터 쉐어링", icon: "📱", description: "데이터를 효율적으로 공유" },
    { id: 4, name: "부가서비스", icon: "🎵", description: "다양한 부가서비스 제공" },
    { id: 5, name: "해외 로밍", icon: "🌏", description: "전 세계 어디서나 데이터와 통화" },
    { id: 6, name: "멤버십 혜택", icon: "🎁", description: "다양한 제휴 멤버십 할인 제공" }
  ];

  const recommendedPlans = [
    { id: 1, name: "5G 베이직", price: "55,000원", data: "100GB", features: ["5G 속도", "기본 통화 무제한", "문자 무제한", "데이터 쉐어링"] },
    { id: 2, name: "5G 프리미엄", price: "77,000원", data: "무제한", features: ["5G 속도", "통화 무제한", "부가서비스 포함", "해외 로밍"] },
    { id: 3, name: "가족 요금제", price: "99,000원", data: "무제한", features: ["최대 5명", "데이터 쉐어링", "통화 무제한", "가족 할인"] }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <div className="main-page">
      {/* 기존 Header 사용 */}
      <Header />

      {/* 메인 배너 */}
      <section className="main-banner">
        <div className="banner-container">
          <div className="banner-slides">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              >
                <img src={banner.image} alt="배너" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  className={banner.buttonClass}
                  style={{ position: 'absolute', ...banner.buttonStyle }}
                >
                  {banner.buttonText}
                </button>
              </div>
            ))}
          </div>
          
          {/* 좌우 화살표 */}
          <button className="banner-arrow banner-arrow-left" onClick={prevSlide}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button className="banner-arrow banner-arrow-right" onClick={nextSlide}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          <div className="banner-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
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

      {/* 추천 요금제 */}
      <section className="plans-section">
        <div className="main-container">
          <h2 className="section-title">추천 요금제</h2>
          <div className="plans-grid">
            {recommendedPlans.map(plan => (
              <div key={plan.id} className="plan-card">
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">{plan.price}</div>
                </div>
                <div className="plan-data">{plan.data}</div>
                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <Link to={`/plans/details/${plan.id}`} className="btn-secondary">
                  자세히 보기
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
