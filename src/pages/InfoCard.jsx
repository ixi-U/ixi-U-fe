import React from "react";
import './InfoCard.css';

export const InfoCard = ({ title, children }) => (
  <section className="info-card">
    <h2 className="info-card-title">{title}</h2>
    <div className="info-card-content">
      {children}
    </div>
  </section>
);

export default InfoCard; 