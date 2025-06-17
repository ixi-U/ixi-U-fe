import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import SocialLogin from "./pages/SocialLogin";
import LoginStatus from "./pages/LoginStatus";
import MainPage from "./pages/MainPage";
import PlanListPage from './components/PlanListPage';
import PlanDetailPage from './components/PlanDetailPage';
import MyPage from './pages/MyPage';
import ChatBotPage from './components/ChatBotPage';
import OnBoarding from "./pages/OnBoarding";
import Logout from "./pages/Logout";

function AppContent() {
  const location = useLocation();
  // const hideHeaderRoutes = ["/", "/onboarding"]; # Header 적용안하는 페이지
  // const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {/* {!shouldHideHeader && <Header />} */}
      <Routes>
        <Route path="/" element={<SocialLogin />} />
        <Route path="/login/status" element={<LoginStatus />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/plans" element={<PlanListPage />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
      </Routes>
    </>
  );
}

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
        <Route path="/plans/details/:planId" element={<PlanDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
      <AppContent />
    </Router>
  );
}

export default App;
