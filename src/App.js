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

function App() {
  // const location = useLocation();
  // const hideHeaderRoutes = ["/", "/onboarding"]; // Header 적용안하는 페이지
  // const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <Router>
      {/* {!shouldHideHeader && <Header />} */}
      <Routes>
        <Route path="/" element={<SocialLogin />} />
        <Route path="/login/status" element={<LoginStatus />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/plans" element={<PlanListPage />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/plans/details/:planId" element={<PlanDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
