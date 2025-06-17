// BundledBenefitForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SingleBenefitRegisterForm.css';

const BundledBenefitRegisterForm = () => {
  const [form, setForm] = useState({
    name: '',
    subscript: '',
    choice: 1,
    singleBenefitIds: []
  });

  const [singleBenefits, setSingleBenefits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const SERVER_URL = process.env.REACT_APP_API_BASE_URL || '/api';

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/benefits/single`)
      .then((res) => setSingleBenefits(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (id) => {
    setForm((prev) => {
      const isSelected = prev.singleBenefitIds.includes(id);
      const updated = isSelected
        ? prev.singleBenefitIds.filter((sid) => sid !== id)
        : [...prev.singleBenefitIds, id];
      return { ...prev, singleBenefitIds: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/api/benefits/bundled`, form);
      setSuccess(true);
      setForm({ name: '', subscript: '', choice: 1, singleBenefitIds: [] });
    } catch (err) {
      console.error('등록 실패', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="benefit-selector">
      <h2 className="form-title">묶음 혜택 등록</h2>
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
          <label>선택 가능 개수</label>
          <input
            type="number"
            name="choice"
            value={form.choice}
            min="1"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>포함할 단일 혜택 선택</label>
          <div className="benefit-card-list">
            {singleBenefits.map((b) => (
              <div
                key={b.id}
                className={`benefit-card ${form.singleBenefitIds.includes(b.id) ? 'selected' : ''}`}
                onClick={() => handleCheckbox(b.id)}
              >
                <strong>{b.name}</strong>
                <p>{b.subscript}</p>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '등록 중...' : '등록하기'}
        </button>
        {success && <p className="success-msg">등록이 완료되었습니다.</p>}
      </form>
    </div>
  );
};

export default BundledBenefitRegisterForm;
