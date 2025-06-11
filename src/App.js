import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/kakao-login";
import LoginStatus from "./pages/LoginStatus";
import MainPage from "./pages/MainPage";
import PlanListPage from './components/PlanListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login/status" element={<LoginStatus />} />{" "}
        {/* 서버에서 리디렉션하는 경로 */}
        <Route path="/mainPage" element={<MainPage />} />{" "}
        {/* 로그인 성공 후 이동할 메인 페이지 */}
        <Route path="/plans" element={<PlanListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
