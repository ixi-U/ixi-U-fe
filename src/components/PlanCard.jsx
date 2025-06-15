import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlanCard.css';

export default function PlanCard({ plan }) {
  const navigate = useNavigate();
  const {
    id,
    name,
    mobileDataLimitMb,
    sharedMobileDataLimitMb,
    callLimitMinutes,
    messageLimit,
    monthlyPrice,
    priority,
  } = plan;

  const handleClick = () => {
    navigate(`/plans/${id}`);
  };

  return (
    <article className="plan-card" onClick={handleClick}>
      <div className="card-head">
        <h3>{name}</h3>
      </div>

      <div className="specs">
        {/* 왼쪽: 데이터, 테더링 */}
        <dl className="specs-left">
          <dt>데이터</dt>
          <dd>
            {mobileDataLimitMb === -1
              ? '무제한'
              : `${Math.round(mobileDataLimitMb / 1024)} GB`}
          </dd>
          <dt>테더링/쉐어링</dt>
          <dd>
            {sharedMobileDataLimitMb === -1
              ? '무제한'
              : `${Math.round(sharedMobileDataLimitMb / 1024)} GB`}
          </dd>
        </dl>

        {/* 오른쪽: 음성, 문자, 기본혜택 */}
        <dl className="specs-right">
          <dt>음성 통화</dt>
          <dd>{callLimitMinutes === -1 ? '집/이동전화 무제한' : `${callLimitMinutes} 분`}</dd>
          <dt>문자 메시지</dt>
          <dd>{messageLimit === -1 ? '기본제공' : `${messageLimit} 건`}</dd>
          <dt>기본혜택</dt>
          <dd>U+ 모바일tv 기본 월정액 무료</dd>
        </dl>
      </div>

      <div className="price-area">
        <strong className="price">
          월&nbsp;
          {monthlyPrice.toLocaleString()}원
        </strong>
        {/* <div className="actions">
          <button className="ghost">비교하기</button>
          <button className="primary">변경하기</button>
        </div> */}
      </div>
    </article>
  );
}