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
    bundledBenefits,
  } = plan;

  const handleClick = () => {
    navigate(`/plans/details/${id}`);
  };

  const isUnlimitedData = mobileDataLimitMb === '무제한';

  // 데이터 변환 함수
  const getDataText = (val) => {
    if (val === -1 || val === '-1') return '제공 안함';
    if (val === 2147483647 || val === '2147483647') return '무제한';
    if (typeof val === 'string') return `데이터 ${val}`;
    if (typeof val === 'number') return `데이터 ${val / 1024}GB`;
    return '데이터 정보 없음';
  };

  const getCallText = (val) => {
    if (val === -1 || val === '-1') return '제공 안함';
    if (val === 2147483647 || val === '2147483647') return '무제한';
    if (val === undefined || val === null || val === '') return '';
    return val;
  };

  const getMessageText = (val) => {
    if (val === -1 || val === '-1') return '제공 안함';
    if (val === 2147483647 || val === '2147483647') return '무제한';
    if (val === undefined || val === null || val === '') return '';
    return val;
  };

  const dataText = getDataText(mobileDataLimitMb);

  const sharedDataAmount = parseInt(sharedMobileDataLimitMb, 10);
  let sharingText = null;

  if (sharedDataAmount > 0) {
    if (isUnlimitedData) {
      sharingText = `기본 제공량 내 쉐어링 ${sharedMobileDataLimitMb}`;
    } else {
      sharingText = `쉐어링 데이터 ${sharedMobileDataLimitMb}`;
    }
  }

  // 값이 렌더링 제외 대상인지 판단하는 함수
  const shouldRender = (value) => {
    if (!value) return false;
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

  const singleBenefitNames =
    Array.isArray(singleBenefits) &&
    singleBenefits
      .map((b) => b && b.name)
      .filter(Boolean)
      .join(', ');

  const bundledBenefitNames =
    Array.isArray(bundledBenefits) &&
    bundledBenefits
      .map((b) => b && b.name)
      .filter(Boolean)
      .join(', ');

  return (
    <article className="plan-card" onClick={handleClick}>
      <div className="plan-card-body">
        <div className="plan-card-left">
          <p className="plan-category">{name} &gt;</p>
          <h3 className="plan-main-feature">{dataText}</h3>
          {sharingText && <p className="plan-sub-feature">{sharingText}</p>}
          <strong className="price">
            월&nbsp;
            {monthlyPrice.toLocaleString()}원
          </strong>
        </div>

        <div className="plan-card-right">
          <dl className="specs-right">
            {renderField('음성통화', getCallText(callLimitMinutes))}
            {renderField('문자메시지', getMessageText(messageLimit))}

            {singleBenefitNames && (
              <>
                <dt>기본혜택</dt>
                <dd>{singleBenefitNames}</dd>
              </>
            )}

            {bundledBenefitNames && (
              <>
                <dt>프리미엄 혜택</dt>
                <dd>{bundledBenefitNames}</dd>
              </>
            )}
          </dl>
          <div className="price-area">
            <button className="change-button">변경하기</button>
          </div>
        </div>
      </div>
    </article>
  );
}
