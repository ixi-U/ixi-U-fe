import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/header/Header";
import SocialLogin from "./pages/login/SocialLogin";
import LoginStatus from "./pages/login/LoginStatus";
import MainPage from "./pages/MainPage";
import PlanListPage from "./pages/plans/plan-list/PlanListPage";
import PlanDetailPage from "./pages/plans/plan-detail/PlanDetailPage";
import ChatBotPage from "./pages/chatbot/ChatBotPage";
import OnBoarding from "./pages/login/OnBoarding";
import Logout from "./pages/login/Logout";
import SingleBenefitRegisterForm from "./pages/admin/SingleBenefitRegisterForm";
import BundledBenefitRegisterForm from "./pages/admin/BundledBenefitRegisterForm";

function AppContent() {
  const location = useLocation();
  // const hideHeaderRoutes = ["/", "/onboarding"]; # Header 적용안하는 페이지
  // const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {/* {!shouldHideHeader && <Header />} */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<SocialLogin />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login/status" element={<LoginStatus />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/plans" element={<PlanListPage />} />
        <Route path="/plans/details" element={<PlanDetailPage />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/admin/benefits/single-benefits" element={<SingleBenefitRegisterForm/>}/>
        <Route path="/admin/benefits/bundled-benefits" element={<BundledBenefitRegisterForm/>}/>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
