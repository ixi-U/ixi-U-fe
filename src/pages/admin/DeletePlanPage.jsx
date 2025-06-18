import React, { useEffect, useState, useCallback } from "react";
import "./RegisterPlan.css";

const DeletePlanPage = () => {
  const [plans, setPlans] = useState([]);

  const loadAdminPlans = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/admin/plans`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      setPlans(data);
    } catch (err) {
      console.error("어드민 요금제 조회 실패:", err);
    }
  }, []);

  useEffect(() => {
    loadAdminPlans();
  }, [loadAdminPlans]);

  const togglePlanState = async (planId) => {
    const confirmed = window.confirm(
      "정말 이 요금제를 사용자에게 비활성화 또는 활성화 하시겠습니까?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/admin/plans/${planId}/toggle`,
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

  return (
    <section className="admin-content">
      <div className="plan-form-wrapper">
        <h2 className="section-title">요금제 삭제</h2>
        <div className="plan-list">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <div
                className="plan-card-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <div>
                  <strong className="plan-name" style={{ marginRight: "12px" }}>
                    {plan.name}
                  </strong>
                  {plan.usageCautions && (
                    <div
                      className="plan-description"
                      style={{
                        marginTop: "4px",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {plan.usageCautions}
                    </div>
                  )}
                  <div
                    className="plan-status"
                    style={{
                      marginTop: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    상태: {plan.planState === "DISABLE" ? "비활성화" : "활성화"}
                  </div>
                </div>
                <button
                  className="plan-disable-btn"
                  onClick={() => togglePlanState(plan.id)}
                  disabled={false}
                  style={{
                    backgroundColor: "#e91e63",
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeletePlanPage;
