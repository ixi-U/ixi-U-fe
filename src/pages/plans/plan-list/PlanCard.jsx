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
    singleBenefits,
    bundledBenefits
  } = plan;

  const handleClick = () => {
    navigate(`/plans/details/${id}`);
  };

  // 값이 렌더링 제외 대상인지 판단하는 함수
  const shouldRender = (value) => {
    const normalized =
      typeof value === 'string' ? value.trim().toUpperCase() : value;
    const excludedValues = ['0 GB', '0 건', '0 분', '-1 건', '-1 분'];
    return !excludedValues.includes(normalized);
  };

  // 조건부 필드 렌더링 함수
  const renderField = (label, value) => {
    if (!shouldRender(value)) return null;
    return (
      <>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </>
    );
  };

  const hasValidSingleBenefits =
    Array.isArray(singleBenefits) && singleBenefits.length > 0;
  const hasValidBundledBenefits =
    Array.isArray(bundledBenefits) && bundledBenefits.length > 0;

  return (
    <article className="plan-card" onClick={handleClick}>
      <div className="card-head">
        <h3>{name}</h3>
      </div>

      <div className="specs">
        <dl className="specs-left">
          {renderField('데이터', mobileDataLimitMb)}
          {renderField('테더링/쉐어링', sharedMobileDataLimitMb)}
        </dl>

        <dl className="specs-right">
          {renderField('음성 통화', callLimitMinutes)}
          {renderField('문자 메시지', messageLimit)}

          {hasValidSingleBenefits && (
            <>
              <dt>기본혜택</dt>
              <dd>{singleBenefits.map((b) => b.name).join(', ')}</dd>
            </>
          )}

          {hasValidBundledBenefits && (
            <>
              <dt>프리미엄 혜택</dt>
              <dd>{bundledBenefits.map((b) => b.name).join(', ')}</dd>
            </>
          )}
        </dl>
      </div>

      <div className="price-area">
        <strong className="price">
          월&nbsp;
          {monthlyPrice.toLocaleString()}원
        </strong>
      </div>
    </article>
  );
}
