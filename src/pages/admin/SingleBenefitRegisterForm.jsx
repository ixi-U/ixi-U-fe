import React, { useState } from 'react';
import axios from 'axios';
import './SingleBenefitRegisterForm.css';

const SingleBenefitForm = () => {
  const [form, setForm] = useState({
    name: '',
    subscript: '',
    benefitType: 'SUBSCRIPTION'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const SERVER_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/api/benefits/single`, form);
      setSuccess(true);
      setForm({ name: '', subscript: '', benefitType: 'SUBSCRIPTION' });
    } catch (err) {
      console.error('등록 실패', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="benefit-selector">
      <h2 className="form-title">단일 혜택 등록</h2>
      <form onSubmit={handleSubmit} className="benefit-form">
        <div className="form-group">
          <label>혜택 이름</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>설명</label>
          <textarea
            name="subscript"
            value={form.subscript}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>혜택 종류</label>
          <select
            name="benefitType"
            value={form.benefitType}
            onChange={handleChange}
          >
            <option value="SUBSCRIPTION">구독</option>
            <option value="DISCOUNT">할인</option>
            <option value="BONUS">보너스</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '등록 중...' : '등록하기'}
        </button>
        {success && <p className="success-msg">등록이 완료되었습니다.</p>}
      </form>
    </div>
  );
};

export default SingleBenefitForm;