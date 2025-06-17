import React from 'react';
import './PlanHistoryItem.css';

const PlanHistoryItem = ({ plan }) => (
  <div className="plan-history-card">
    <div className="plan-history-card-header">
      <span className="plan-history-title">{plan.planName} &gt;</span>
    </div>
    <div className="plan-history-main">
      <div className="plan-history-main-left">
        <div className="plan-history-desc">가입일: {new Date(plan.subscribedAt).toLocaleDateString()}</div>
      </div>
    </div>
  </div>
);

export default PlanHistoryItem; 