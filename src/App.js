import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import Footer from "./components/footer/Footer";
import SocialLogin from "./pages/login/SocialLogin";
import LoginStatus from "./pages/login/LoginStatus";
import MyPage from "./pages/user/MyPage";
import PlanListPage from "./pages/plans/plan-list/PlanListPage";
import PlanDetailPage from "./pages/plans/plan-detail/PlanDetailPage";
import ChatBotPage from "./pages/chatbot/ChatBotPage";
import Onboarding from "./pages/login/OnBoarding";
import Logout from "./pages/login/Logout";
import RegisterPlan from "./pages/admin/RegisterPlanPage";
import AdminLayout from "./pages/admin/AdminLayout";
import DeletePlan from "./pages/admin/DeletePlanPage";
import SingleBenefitRegisterForm from "./pages/admin/SingleBenefitRegisterForm";
import BundledBenefitRegisterForm from "./pages/admin/BundledBenefitRegisterForm";
import AdminPage from './pages/admin/AdminPage';
import Header from "./components/header/Header";

function App() {
  // const location = useLocation();
  // const hideHeaderRoutes = ["/", "/onboarding"]; // Header 적용안하는 페이지
  // const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <Router>
      {/* {!shouldHideHeader && <Header />} */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<SocialLogin />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login/status" element={<LoginStatus />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/plans" element={<PlanListPage />} />
        <Route path="/plans/details" element={<PlanDetailPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/mypage/plan" element={<AdminLayout />}>
        </Route>
        <Route path="/plans/details/:planId" element={<PlanDetailPage />} />
        <Route
          path="/admin/benefits/single-benefits"
          element={<SingleBenefitRegisterForm />}
        />
        <Route
          path="/admin/benefits/bundled-benefits"
          element={<BundledBenefitRegisterForm />}
        />
        <Route path="/admin" element={<AdminPage />} />
          <Route path="register" element={<RegisterPlan />} />
          <Route path="delete" element={<DeletePlan />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
