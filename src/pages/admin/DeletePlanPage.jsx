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
          {filteredPlans.map((plan) => (
            <article key={plan.id} className="delete-plan-card">
              <div className="card-head">
                <h3>{plan.name}</h3>
                    </div>
              <div className="specs">
                <dl className="specs-left">
                  <dt>데이터</dt>
                  <dd>{plan.mobileDataLimitMb !== undefined && plan.mobileDataLimitMb !== null && plan.mobileDataLimitMb !== '' ? plan.mobileDataLimitMb : '-'}</dd>
                  <dt>테더링/쉐어링</dt>
                  <dd>{plan.sharedMobileDataLimitMb !== undefined && plan.sharedMobileDataLimitMb !== null && plan.sharedMobileDataLimitMb !== '' ? plan.sharedMobileDataLimitMb : '-'}</dd>
                </dl>
                <dl className="specs-right">
                  <dt>음성 통화</dt>
                  <dd>{plan.callLimitMinutes !== undefined && plan.callLimitMinutes !== null && plan.callLimitMinutes !== '' ? plan.callLimitMinutes : '-'}</dd>
                  <dt>문자 메시지</dt>
                  <dd>{plan.messageLimit !== undefined && plan.messageLimit !== null && plan.messageLimit !== '' ? plan.messageLimit : '-'}</dd>
                  <dt>기본혜택</dt>
                  <dd>{(!plan.singleBenefits || plan.singleBenefits.length === 0)
                    ? '기본제공'
                    : plan.singleBenefits.map(b => b.name).join(', ')}</dd>
                  {plan.bundledBenefits && plan.bundledBenefits.length > 0 && (
                    <>
                      <dt>프리미엄 혜택</dt>
                      <dd>{plan.bundledBenefits.map(b => b.name).join(', ')}</dd>
                    </>
                  )}
                  <dt>상태</dt>
                  <dd>{plan.planState === "DISABLE" ? "비활성화" : "활성화"}</dd>
                </dl>
                  </div>
              <div className="price-area">
                <strong className="price">
                  월&nbsp;
                  {plan.monthlyPrice ? plan.monthlyPrice.toLocaleString() : '-'}원
                </strong>
                <button
                  className="plan-disable-btn primary"
                  onClick={() => togglePlanState(plan.id)}
                  disabled={false}
                  style={{
                    backgroundColor: plan.planState === "DISABLE" ? "#4caf50" : "#e91e63",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {plan.planState === "DISABLE" ? "활성화" : "비활성화"}
                </button>
              </div>
            </article>
          ))}
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
