// 서버에서 받음으로 필요 없음

// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const KakaoRedirectHandler = () => {ㄴ
//   const navigate = useNavigate();

//   useEffect(() => {
//     const code = new URL(window.location.href).searchParams.get("code");

//     if (code) {
//       console.log("인가 코드:", code);
//       // 여기서 백엔드에 토큰 요청하는 코드 작성 가능
//       navigate("/success");
//     } else {
//       alert("로그인 실패: 인가 코드 없음");
//     }
//   }, [navigate]);

//   return <div>로그인 처리 중...</div>;
// };

// export default KakaoRedirectHandler;
