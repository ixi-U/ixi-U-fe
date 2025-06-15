import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SocialLogin from "./pages/SocialLogin";
import LoginStatus from "./pages/LoginStatus";
import MainPage from "./pages/MainPage";
import OnBoarding from "./pages/OnBoarding";
import Logout from "./pages/Logout";
import PlanListPage from "./components/PlanListPage";
import PlanDetailPage from "./pages/PlanDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SocialLogin />} />
        <Route path="/login/status" element={<LoginStatus />} />{" "}
        {/* 서버에서 리디렉션하는 경로 */}
        <Route path="/mainPage" element={<MainPage />} />{" "}
        {/* 로그인 성공 후 이동할 메인 페이지 */}
        <Route path="/plans" element={<PlanListPage />} />
        <Route path="/plans/:planId" element={<PlanDetailPage />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
