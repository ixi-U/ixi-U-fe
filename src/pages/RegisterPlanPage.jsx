import React, { useState } from "react";
import "../components/RegisterPlan.css";

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
      /^[0-9]{1,3}$/.test(value) || value === "무제한";
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
    if (!["ABLE", "DISABLED"].includes(state))
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
      usageCautions: form.usageCautions,
      mobileDataLimitMb: convertToNumberOrNull(form.mobileDataLimitMb),
      callLimitMinutes: convertToNumberOrNull(form.callLimitMinutes),
      messageLimit: convertToNumberOrNull(form.messageLimit),
      monthlyPrice: form.monthlyPrice === "" ? null : Number(form.monthlyPrice),
      priority: form.priority === "" ? null : Number(form.priority),
      sharedMobileDataLimitMb: convertToNumberOrNull(
        form.sharedMobileDataLimitMb
      ),
      mobileDataThrottleSpeedKbps: convertToNumberOrNull(
        form.mobileDataThrottleSpeedKbps
      ),
      minAge: convertToNumberOrNull(form.minAge),
      maxAge: convertToNumberOrNull(form.maxAge),
      isActiveDuty: form.isActiveDuty,
      pricePerKb: form.pricePerKb === "" ? null : Number(form.pricePerKb),
      etcInfo: form.etcInfo,
      singleBenefits: [],
      bundledBenefits: [],
    };

    Object.keys(requestBody).forEach(
      (k) => requestBody[k] === null && delete requestBody[k]
    );

    try {
      const response = await fetch("/admin/plans/save", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
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
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="">선택</option>
            <option value="FIVE_G_LTE">5G/LTE</option>
            <option value="ONLINE">ONLINE</option>
            <option value="TABLET_SMARTWATCH">TABLET/SMARTWATCH</option>
            <option value="DUAL_NUMBER">DUAL NUMBER</option>
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
          <select name="state" value={form.state} onChange={handleChange}>
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
        <fieldset className="form-group">
          <legend>단일 혜택 선택 (Single Benefits)</legend>
          {["DEVICE", "DISCOUNT", "SUBSCRIPTION"].map((type) => (
            <div
              key={`single-${type}`}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <input
                type="checkbox"
                value={type}
                checked={
                  form.singleBenefits && form.singleBenefits.includes(type)
                }
                onChange={(e) => {
                  const updated = e.target.checked ? [type] : [];
                  setForm({ ...form, singleBenefits: updated });
                }}
              />
              <label style={{ marginLeft: "8px" }}>
                {type === "DEVICE"
                  ? "스마트 기기"
                  : type === "DISCOUNT"
                  ? "할인"
                  : "구독"}
              </label>
            </div>
          ))}
        </fieldset>
        <fieldset className="form-group">
          <legend>묶음 혜택 선택 (Bundled Benefits)</legend>
          {["DEVICE", "DISCOUNT", "SUBSCRIPTION"].map((type) => (
            <div
              key={`bundled-${type}`}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <input
                type="checkbox"
                value={type}
                checked={
                  form.bundledBenefits && form.bundledBenefits.includes(type)
                }
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...(form.bundledBenefits || []), type]
                    : (form.bundledBenefits || []).filter((t) => t !== type);
                  setForm({ ...form, bundledBenefits: updated });
                }}
              />
              <label style={{ marginLeft: "8px" }}>
                {type === "DEVICE"
                  ? "스마트 기기"
                  : type === "DISCOUNT"
                  ? "할인"
                  : "구독"}
              </label>
            </div>
          ))}
        </fieldset>
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
