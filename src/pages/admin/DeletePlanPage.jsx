import React, { useEffect, useState, useCallback } from "react";
import "./DeletePlan.css";

const formatData = (mb) => {
  if (typeof mb === "string") return mb; // 이미 문자열(단위 포함)로 오면 그대로 반환
  if (mb === -1) return "무제한";
  if (!mb) return "0MB";
  if (mb < 1024) return `${mb}MB`;
  const gb = (mb / 1024).toFixed(1);
  return `${gb.endsWith('.0') ? Math.floor(mb / 1024) : gb}GB`;
}

const DeletePlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all", "active", "inactive"

  // 요금제 id 목록만 받아오기
  const loadAdminPlanIds = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/admin/plans`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      // id만 추출
      return Array.isArray(data) ? data.map(p => p.id) : [];
    } catch (err) {
      console.error("어드민 요금제 id 조회 실패:", err);
      return [];
    }
  }, []);

  // 각 id별로 상세 정보 불러오기
  const loadPlanDetails = useCallback(async (ids) => {
    try {
      const detailPromises = ids.map(id =>
        fetch(`${process.env.REACT_APP_API_BASE}/plans/details/${id}`, {
          method: "GET",
          credentials: "include",
        })
          .then(res => res.json())
          .then(plan => ({ ...plan, id }))
          .catch(() => null)
      );
      const details = await Promise.all(detailPromises);
      // null(실패) 제외
      setPlans(details.filter(Boolean));
    } catch (err) {
      console.error("요금제 상세 조회 실패:", err);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const ids = await loadAdminPlanIds();
      if (ids.length > 0) {
        await loadPlanDetails(ids);
      } else {
        setPlans([]);
      }
    })();
  }, [loadAdminPlanIds, loadPlanDetails]);

  const togglePlanState = async (planId) => {
    const confirmed = window.confirm(
      "정말 이 요금제를 사용자에게 비활성화 또는 활성화 하시겠습니까?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/admin/plans/${planId}/disable`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        alert("요금제 상태가 변경되었습니다.");
        // 상태만 토글 (다시 상세조회 안함)
        setPlans(
          plans.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  planState: p.planState === "DISABLE" ? "ABLE" : "DISABLE",
                }
              : p
          )
        );
      } else {
        alert("상태 변경 실패");
      }
    } catch (err) {
      alert("서버 오류");
    }
  };

  // 탭에 따른 필터링된 요금제 목록
  const filteredPlans = plans.filter(plan => {
    switch (activeTab) {
      case "active":
        return plan.planState === "ABLE";
      case "inactive":
        return plan.planState === "DISABLE";
      default:
        return true; // "all" - 모든 요금제
    }
  });

  // PlanCard 로직 적용
  const renderPlanCard = (plan) => {
    const isUnlimitedData = plan.mobileDataLimitMb === 2147483647;

    let dataText;
    if (isUnlimitedData) {
      dataText = '데이터 무제한';
    } else if (typeof plan.mobileDataLimitMb === 'string') {
      dataText = `데이터 ${plan.mobileDataLimitMb}`;
    } else if (typeof plan.mobileDataLimitMb === 'number') {
      dataText = `데이터 ${plan.mobileDataLimitMb / 1024}GB`;
    } else {
      dataText = '데이터 정보 없음';
    }

    // 쉐어링 데이터 변환
    let sharingText = null;
    let sharingValue = null;
    if (plan.sharedMobileDataLimitMb !== undefined && plan.sharedMobileDataLimitMb !== null && plan.sharedMobileDataLimitMb !== '' && !isNaN(Number(plan.sharedMobileDataLimitMb))) {
      const gb = Number(plan.sharedMobileDataLimitMb) / 1024;
      sharingValue = gb + 'GB';
    }
    if (sharingValue && Number(plan.sharedMobileDataLimitMb) > 0) {
      if (isUnlimitedData) {
        sharingText = `기본 제공량 내 쉐어링 ${sharingValue}`;
      } else {
        sharingText = `쉐어링 데이터 ${sharingValue}`;
      }
    }

    // 음성/문자 변환
    const getCallText = (val) => {
      if (val === 2147483647 || val === '2147483647') return '기본제공';
      if (val === undefined || val === null || val === '') return '';
      return val + '분';
    };
    const getMessageText = (val) => {
      if (val === 2147483647 || val === '2147483647') return '기본제공';
      if (val === undefined || val === null || val === '') return '';
      return val + '건';
    };

    const shouldRender = (value) => {
      if (!value) return false;
      const normalized =
        typeof value === 'string' ? value.trim().toUpperCase() : value;
      const excludedValues = ['0 GB', '0 건', '0 분', '-1 건', '-1 분'];
      return !excludedValues.includes(normalized);
    };

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
      Array.isArray(plan.singleBenefits) &&
      plan.singleBenefits
        .map((b) => b && b.name)
        .filter(Boolean)
        .join(', ');

    const bundledBenefitNames =
      Array.isArray(plan.bundledBenefits) &&
      plan.bundledBenefits
        .map((b) => b && b.name)
        .filter(Boolean)
        .join(', ');

    return (
      <article key={plan.id} className="delete-plan-card">
        <div className="delete-plan-card-body">
          <div className="delete-plan-card-left">
            <p className="delete-plan-category">{plan.name} &gt;</p>
            <h3 className="delete-plan-main-feature">{dataText}</h3>
            {sharingText && <p className="delete-plan-sub-feature">{sharingText}</p>}
            <strong className="delete-price">
              월&nbsp;
              {plan.monthlyPrice.toLocaleString()}원
            </strong>
          </div>

          <div className="delete-plan-card-right">
            <dl className="delete-specs-right">
              {renderField('음성통화', getCallText(plan.callLimitMinutes))}
              {renderField('문자메시지', getMessageText(plan.messageLimit))}
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
              <dt>상태</dt>
              <dd
                className={
                  plan.planState === 'DISABLE' ? 'delete-state-disabled' : 'delete-state-able'
                }
              >
                {plan.planState === 'DISABLE' ? '비활성화' : '활성화'}
              </dd>
            </dl>
            <div className="delete-price-area">
              <button
                className={`delete-plan-toggle-btn ${
                  plan.planState === 'DISABLE' ? 'enable' : 'disable'
                }`}
                onClick={() => togglePlanState(plan.id)}
              >
                {plan.planState === 'DISABLE' ? '활성화' : '비활성화'}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="admin-content">
       <main className="delete-plan-container">
        <h2 className="section-title">요금제 상태 변경</h2>
        
        {/* 탭 네비게이션 */}
        <ul className="delete-plan-nav">
          <li 
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            전체 ({plans.length})
          </li>
          <li 
            className={activeTab === "active" ? "active" : ""}
            onClick={() => setActiveTab("active")}
          >
            활성화 ({plans.filter(p => p.planState === "ABLE").length})
          </li>
          <li 
            className={activeTab === "inactive" ? "active" : ""}
            onClick={() => setActiveTab("inactive")}
          >
            비활성화 ({plans.filter(p => p.planState === "DISABLE").length})
          </li>
        </ul>

        <div className="delete-plan-card-list">
          {filteredPlans.map((plan) => renderPlanCard(plan))}
        </div>
        
        {/* 필터링된 결과가 없을 때 메시지 */}
        {filteredPlans.length === 0 && (
          <div style={{ textAlign: "center", margin: "40px 0", color: "#666" }}>
            {activeTab === "all" 
              ? "등록된 요금제가 없습니다." 
              : activeTab === "active" 
                ? "활성화된 요금제가 없습니다." 
                : "비활성화된 요금제가 없습니다."}
          </div>
        )}
        </main>
    </section>
  );
};

export default DeletePlanPage;
