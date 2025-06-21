import React, { useState } from "react";
import "./RegisterPlan.css";
const initialState = {
  name: "",
  type: "",
  usageCautions: "",
  mobileDataLimitMb: "",
  callLimitMinutes: "",
  messageLimit: "",
  monthlyPrice: "",
  priority: "",
  state: "ABLE",
  sharedMobileDataLimitMb: "",
  mobileDataThrottleSpeedKbps: "",
  minAge: "",
  maxAge: "",
  isActiveDuty: false,
  pricePerKb: "",
  etcInfo: "",
};
const RegisterPlan = () => {
  const [form, setForm] = useState(initialState);
  const bundledBenefitOptions = [
    { id: 1, name: "지니 6개월" },
    { id: 2, name: "넷플릭스 3개월" },
    { id: 3, name: "왓챠 프리미엄" },
  ];
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const validate = () => {
    const {
      name,
      type,
      mobileDataLimitMb,
      callLimitMinutes,
      messageLimit,
      monthlyPrice,
      state,
      sharedMobileDataLimitMb,
      mobileDataThrottleSpeedKbps,
      minAge,
      maxAge,
      pricePerKb,
    } = form;
    const isLengthIn = (value, min, max) =>
      value.length >= min && value.length <= max;
    const isValidNumberOrUnlimited = (value) =>
      /^[0-9]{1,10000}$/.test(value) || value === "무제한";
    const isValidNumber = (value) => /^\d*$/.test(value);
    const isValidPricePerKb = (value) =>
      /^\d+(\.\d+)?$/.test(value) || value === "";
    if (!isLengthIn(name, 1, 10)) return "요금제 이름은 1~10자여야 합니다.";
    if (!type) return "요금제 분류를 선택해주세요.";
    if (!isValidNumberOrUnlimited(mobileDataLimitMb))
      return "데이터량은 1~3자 양의 정수 또는 '무제한'이어야 합니다.";
    if (!isValidNumberOrUnlimited(callLimitMinutes))
      return "통화량은 1~3자 양의 정수 또는 '무제한'이어야 합니다.";
    if (!isValidNumberOrUnlimited(messageLimit))
      return "문자량은 1~3자 양의 정수 또는 '무제한'이어야 합니다.";
    if (!isLengthIn(monthlyPrice, 1, 7)) return "월금액은 1~7자여야 합니다.";
    if (!["ABLE", "DISABLE"].includes(state))
      return "요금제 상태를 선택해주세요.";
    if (sharedMobileDataLimitMb && !isValidNumber(sharedMobileDataLimitMb))
      return "공유 데이터량은 숫자만 입력 가능합니다.";
    if (
      mobileDataThrottleSpeedKbps &&
      !isValidNumber(mobileDataThrottleSpeedKbps)
    )
      return "속도제한은 숫자만 입력 가능합니다.";
    if (minAge && !isValidNumber(minAge))
      return "최소 연령은 숫자만 입력 가능합니다.";
    if (maxAge && !isValidNumber(maxAge))
      return "최대 연령은 숫자만 입력 가능합니다.";
    if (minAge && maxAge && Number(minAge) > Number(maxAge))
      return "최소 연령은 최대 연령보다 작거나 같아야 합니다.";
    if (pricePerKb && !isValidPricePerKb(pricePerKb))
      return "1KB당 요금은 숫자 또는 소수점 숫자만 입력 가능합니다.";
    if (!form.singleBenefitInput?.trim()) {
      return "단일 혜택은 비워둘 수 없습니다.";
    }
    return null;
  };
  const convertToNumberOrNull = (v) => {
    if (v === "") return null;
    if (v === "무제한") return -1;
    return Number(v);
  };
  const handleSubmit = async () => {
    const error = validate();
    if (error) return alert(error);
    const requestBody = {
      name: form.name,
      type: form.type,
      state: form.state,
      usageCautions: form.usageCautions || null,
      mobileDataLimitMb:
        form.mobileDataLimitMb === ""
          ? null
          : convertToNumberOrNull(form.mobileDataLimitMb),
      callLimitMinutes: convertToNumberOrNull(form.callLimitMinutes) ?? 0,
      messageLimit: convertToNumberOrNull(form.messageLimit) ?? 0,
      monthlyPrice: form.monthlyPrice === "" ? 0 : Number(form.monthlyPrice),
      priority: form.priority === "" ? 0 : Number(form.priority),
      sharedMobileDataLimitMb:
        form.sharedMobileDataLimitMb === ""
          ? null
          : convertToNumberOrNull(form.sharedMobileDataLimitMb),
      mobileDataThrottleSpeedKbps:
        form.mobileDataThrottleSpeedKbps === ""
          ? null
          : convertToNumberOrNull(form.mobileDataThrottleSpeedKbps),
      minAge: form.minAge === "" ? null : convertToNumberOrNull(form.minAge),
      maxAge: form.maxAge === "" ? null : convertToNumberOrNull(form.maxAge),
      isActiveDuty: form.isActiveDuty,
      pricePerKb: form.pricePerKb === "" ? null : Number(form.pricePerKb),
      etcInfo: form.etcInfo || null,
      singleBenefits: form.singleBenefitInput?.trim()
        ? [form.singleBenefitInput.trim()]
        : null,
      bundledBenefits: form.bundledBenefits?.length
        ? form.bundledBenefits
        : null,
    };
    Object.keys(requestBody).forEach(
      (k) => requestBody[k] === null && delete requestBody[k]
    );
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/admin/plans/save`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
      if (response.status === 409) {
        alert("이미 존재하는 요금제입니다.");
      } else if (response.ok) {
        alert("요금제가 등록되었습니다.");
        setForm(initialState);
      } else if (response.status === 302) {
        alert("권한이 없습니다.");
      } else {
        alert("등록 실패");
      }
    } catch (err) {
      console.log(
        "요청 주소: ",
        `${process.env.REACT_APP_API_BASE}/admin/plans/save`
      );
      alert("서버 오류");
    }
  };
  return (
    <div className="plan-form-card">
      <h3 className="plan-form-title">요금제 추가</h3>
      <form className="plan-form">
        <div className="plan-form-group">
          <label>요금제 이름</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>요금제 분류</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="">선택</option>
            <option value="FIVE_G_LTE">5G/LTE</option>
            <option value="ONLINE">ONLINE</option>
            <option value="TABLET_SMARTWATCH">TABLET/SMARTWATCH</option>
            <option value="DUAL_NUMBER">DUAL NUMBER</option>
          </select>
        </div>
        <div className="plan-form-group">
          <label>요금제 설명</label>
          <input
            name="usageCautions"
            value={form.usageCautions}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>데이터량(MB)</label>
          <input
            name="mobileDataLimitMb"
            value={form.mobileDataLimitMb}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>음성(통화량, 분)</label>
          <input
            name="callLimitMinutes"
            value={form.callLimitMinutes}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>문자량</label>
          <input
            name="messageLimit"
            value={form.messageLimit}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>월금액(정가)</label>
          <input
            name="monthlyPrice"
            value={form.monthlyPrice}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>판매 우선순위</label>
          <input
            name="priority"
            value={form.priority}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>요금제 상태</label>
          <select name="state" value={form.state} onChange={handleChange}>
            <option value="ABLE">ABLE</option>
            <option value="DISABLE">DISABLE</option>
          </select>
        </div>
        <div className="plan-form-group">
          <label>공유 데이터량(MB)</label>
          <input
            name="sharedMobileDataLimitMb"
            value={form.sharedMobileDataLimitMb}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>속도제한(Kbps)</label>
          <input
            name="mobileDataThrottleSpeedKbps"
            value={form.mobileDataThrottleSpeedKbps}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>최소 연령</label>
          <input
            name="minAge"
            value={form.minAge}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>최대 연령</label>
          <input
            name="maxAge"
            value={form.maxAge}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group plan-form-checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isActiveDuty"
              checked={form.isActiveDuty}
              onChange={handleChange}
            />
            현역 여부 (군인 혜택)
          </label>
        </div>
        <div className="plan-form-group">
          <label>단일 혜택 (Single Benefit)</label>
          <input
            type="text"
            name="singleBenefitInput"
            value={form.singleBenefitInput || ""}
            onChange={(e) =>
              setForm({
                ...form,
                singleBenefitInput: e.target.value,
                singleBenefits: e.target.value ? [e.target.value] : [],
              })
            }
            className="single-benefit-input"
          />
        </div>
        <div className="plan-form-group">
          <label>묶음 혜택 (Bundled)</label>
          <div className="form-group">
            {bundledBenefitOptions.map((benefit) => (
              <div key={benefit.id} className="benefit-row">
                <input
                  type="checkbox"
                  id={`bundled-${benefit.id}`}
                  checked={(form.bundledBenefits || []).includes(benefit.id)}
                  onChange={(e) => {
                    const current = form.bundledBenefits || [];
                    const updated = e.target.checked
                      ? [...current, benefit.id]
                      : current.filter((id) => id !== benefit.id);
                    setForm({ ...form, bundledBenefits: updated });
                  }}
                />
                <label htmlFor={`bundled-${benefit.id}`}>{benefit.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="plan-form-group">
          <label>1KB당 요금</label>
          <input
            name="pricePerKb"
            value={form.pricePerKb}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="plan-form-group">
          <label>기타 정보</label>
          <input
            name="etcInfo"
            value={form.etcInfo}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="button-right">
          <button onClick={handleSubmit} className="plan-form-btn">등록하기</button>
        </div>
      </form>
    </div>
  );
};
export default RegisterPlan;