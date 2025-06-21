import React, { useEffect, useState } from 'react';
import { fetchPlanHistory } from '../../api/planApi';
import { getMyPlan } from '../../api/userApi';
import PlanHistoryItem from './PlanHistoryItem';
import './PlanHistoryList.css';
import { useNavigate } from 'react-router-dom';

const PlanHistoryList = () => {
  const [history, setHistory] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [sort, setSort] = useState('desc'); // 'desc' = 최신순, 'asc' = 오래된순
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchPlanHistory(),
      getMyPlan().catch(() => null) // 현재 플랜이 없을 수 있으므로 에러 처리
    ]).then(([historyData, currentPlanData]) => {
      setHistory(historyData);
      setCurrentPlan(currentPlanData);
      setLoading(false);
    });
  }, []);

  // 정렬
  const sortedHistory = [...history].sort((a, b) => {
    if (sort === 'desc') {
      return new Date(b.subscribedAt) - new Date(a.subscribedAt);
    } else {
      return new Date(a.subscribedAt) - new Date(b.subscribedAt);
    }
  });

  return (
    <div className="plan-history-list-root">
      <div className="plan-history-list-header">
        <h2>요금제 히스토리</h2>
        <div className="plan-history-sort-btns">
          <button onClick={() => setSort('desc')} className={sort === 'desc' ? 'active' : ''}>최신순</button>
          <button onClick={() => setSort('asc')} className={sort === 'asc' ? 'active' : ''}>오래된순</button>
        </div>
      </div>
      {loading ? (
        <div>로딩중...</div>
      ) : (
        <div>
          {sortedHistory.length === 0 ? (
            <div style={{textAlign:'center', margin:'32px 0'}}>
              <div>이용 내역이 없습니다.</div>
            </div>
          ) : (
            sortedHistory.map((plan, index) => (
              <PlanHistoryItem 
                key={plan.subscribedId} 
                plan={plan} 
                isCurrentPlan={currentPlan && currentPlan.name === plan.planName && index === 0}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PlanHistoryList; 