import React, { useState } from "react";
import "../components/RegisterPlan.css";

const initialState = {
  name: "", // 요금제 이름
  planType: "", // 요금제 분류
  usageCautions: "", // 요금제 설명 (usage cautions)
  mobileDataLimitMb: "", // 데이터량
  callLimitMinutes: "", // 음성(통화량)
  messageLimit: "", // 문자량
  monthlyPrice: "", // 월금액(정가)
  priority: "", // 판매 우선순위
  planState: "ABLE", // 요금제 상태
  sharedMobileDataLimitMb: "", // 공유 데이터량
  mobileDataThrottleSpeedKbps: "", // 속도 제한
  minAge: "", // 최소 연령
  maxAge: "", // 최대 연령
  isActiveDuty: false, // 현역 여부(군인 혜택)
  pricePerKb: "",
  etcInfo: "",
};

const RegisterPlan = () => {
  const [form, setForm] = useState(initialState);

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
      planType,
      mobileDataLimitMb,
      callLimitMinutes,
      messageLimit,
      monthlyPrice,
      planState,
      sharedMobileDataLimitMb,
      mobileDataThrottleSpeedKbps,
      minAge,
      maxAge,
      pricePerKb,
    } = form;
    const isLengthIn = (value, min, max) =>
      value.length >= min && value.length <= max;
    const isValidNumberOrUnlimited = (value) =>
      /^[0-9]{1,3}$/.test(value) || value === "무제한";
    const isValidNumber = (value) => /^\d*$/.test(value);
    const isValidPricePerKb = (value) =>
      /^\d+(\.\d+)?$/.test(value) || value === "";

    if (!isLengthIn(name, 1, 10)) return "요금제 이름은 1~10자여야 합니다.";
    if (!planType) return "요금제 분류를 선택해주세요.";
    if (!isValidNumberOrUnlimited(mobileDataLimitMb))
      return "데이터량은 1~3자 양의 정수 또는 '무제한'이어야 합니다.";
    if (!isValidNumberOrUnlimited(callLimitMinutes))
      return "통화량은 1~3자 양의 정수 또는 '무제한'이어야 합니다.";
    if (!isValidNumberOrUnlimited(messageLimit))
      return "문자량은 1~3자 양의 정수 또는 '무제한'이어야 합니다.";
    if (!isLengthIn(monthlyPrice, 1, 7)) return "월금액은 1~7자여야 합니다.";
    if (!["ABLE", "DISABLED"].includes(planState))
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

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return alert(error);

    try {
      const response = await fetch("/api/admin/plans", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.status === 409) {
        alert("이미 존재하는 요금제입니다.");
      } else if (response.ok) {
        alert("요금제가 등록되었습니다.");
        setForm(initialState);
      } else {
        alert("등록 실패");
      }
    } catch (err) {
      alert("서버 오류");
    }
  };

  return (
    <section className="admin-content">
      <div className="plan-form-wrapper">
        <label>
          요금제 이름
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          요금제 분류
          <select name="planType" value={form.planType} onChange={handleChange}>
            <option value="">선택</option>
            <option value="MOBILE">MOBILE</option>
            <option value="INTERNET">INTERNET</option>
          </select>
        </label>
        <label>
          요금제 설명
          <input
            name="usageCautions"
            value={form.usageCautions}
            onChange={handleChange}
          />
        </label>
        <label>
          데이터량(MB)
          <input
            name="mobileDataLimitMb"
            value={form.mobileDataLimitMb}
            onChange={handleChange}
          />
        </label>
        <label>
          음성(통화량, 분)
          <input
            name="callLimitMinutes"
            value={form.callLimitMinutes}
            onChange={handleChange}
          />
        </label>
        <label>
          문자량
          <input
            name="messageLimit"
            value={form.messageLimit}
            onChange={handleChange}
          />
        </label>
        <label>
          월금액(정가)
          <input
            name="monthlyPrice"
            value={form.monthlyPrice}
            onChange={handleChange}
          />
        </label>
        <label>
          판매 우선순위
          <input
            name="priority"
            value={form.priority}
            onChange={handleChange}
          />
        </label>
        <label>
          요금제 상태
          <select
            name="planState"
            value={form.planState}
            onChange={handleChange}
          >
            <option value="ABLE">ABLE</option>
            <option value="DISABLED">DISABLED</option>
          </select>
        </label>
        <label>
          공유 데이터량(MB)
          <input
            name="sharedMobileDataLimitMb"
            value={form.sharedMobileDataLimitMb}
            onChange={handleChange}
          />
        </label>
        <label>
          속도제한(Kbps)
          <input
            name="mobileDataThrottleSpeedKbps"
            value={form.mobileDataThrottleSpeedKbps}
            onChange={handleChange}
          />
        </label>
        <label>
          최소 연령
          <input name="minAge" value={form.minAge} onChange={handleChange} />
        </label>
        <label>
          최대 연령
          <input name="maxAge" value={form.maxAge} onChange={handleChange} />
        </label>
        {/* <label className="inline-label">
          <span>현역 여부 (군인 혜택)</span>
          <input
            type="checkbox"
            name="isActiveDuty"
            checked={form.isActiveDuty}
            onChange={handleChange}
          />
        </label> */}
        <div className="form-group">
          <label htmlFor="isActiveDuty">현역 여부 (군인 혜택)</label>
          <input
            id="isActiveDuty"
            type="checkbox"
            name="isActiveDuty"
            checked={form.isActiveDuty}
            onChange={handleChange}
          />
        </div>
        <label>
          1KB당 요금
          <input
            name="pricePerKb"
            value={form.pricePerKb}
            onChange={handleChange}
          />
        </label>
        <label>
          기타 정보
          <input name="etcInfo" value={form.etcInfo} onChange={handleChange} />
        </label>
        <div className="button-right">
          <button onClick={handleSubmit}>저장</button>
        </div>
      </div>
    </section>
  );
};

export default RegisterPlan;
