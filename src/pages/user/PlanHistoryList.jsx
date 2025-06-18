import React, { useEffect, useState } from 'react';
import { fetchPlanHistory } from '../../api/planApi';
import PlanHistoryItem from './PlanHistoryItem';
import './PlanHistoryList.css';

const PlanHistoryList = () => {
  const [history, setHistory] = useState([]);
  const [sort, setSort] = useState('desc'); // 'desc' = 최신순, 'asc' = 오래된순
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPlanHistory().then(data => {
      setHistory(data);
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
        <button className="plan-history-change-btn">사용 중 요금제 변경 &gt;</button>
      </div>
      {loading ? (
        <div>로딩중...</div>
      ) : (
        <div>
          {sortedHistory.length === 0 ? (
            <div>이용 내역이 없습니다.</div>
          ) : (
            sortedHistory.map(plan => (
              <PlanHistoryItem key={plan.subscribedId} plan={plan} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PlanHistoryList; 