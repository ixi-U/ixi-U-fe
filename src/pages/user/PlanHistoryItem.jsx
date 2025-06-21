import React from 'react';
import './PlanHistoryItem.css';

const PlanHistoryItem = ({ plan, isCurrentPlan }) => (
  <div className="plan-history-card">
    <div className="plan-history-card-header">
      <span className="plan-history-title">
        {plan.planName} &gt;
        {isCurrentPlan && (
          <span className="current-plan-badge">사용중</span>
        )}
      </span>
    </div>
    <div className="plan-history-main">
      <div className="plan-history-main-left">
        <div className="plan-history-desc">가입일: {new Date(plan.subscribedAt).toLocaleDateString()}</div>
      </div>
    </div>
  </div>
);

export default PlanHistoryItem; 