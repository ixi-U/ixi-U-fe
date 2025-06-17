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
import ChatBotPage from './components/ChatBotPage';
import OnBoarding from "./pages/OnBoarding";
import Logout from "./pages/Logout";
import SingleBenefitRegisterForm from "./components/SingleBenefitRegisterForm";

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
        <Route path="/admin/benefits/single-benefits" element={<SingleBenefitRegisterForm/>}/>
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
