import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
<<<<<<< HEAD
import Header from "./components/Header";
import SocialLogin from "./pages/SocialLogin";
import LoginStatus from "./pages/LoginStatus";
import MainPage from "./pages/MainPage";
import PlanListPage from "./components/PlanListPage";
import PlanDetailPage from "./components/PlanDetailPage";
import ChatBotPage from "./components/ChatBotPage";
import OnBoarding from "./pages/OnBoarding";
import Logout from "./pages/Logout";
import RegisterPlan from "./pages/RegisterPlanPage";
import AdminLayout from "./components/AdminLayout";
import DeletePlan from "./pages/DeletePlanPage";
=======
>>>>>>> origin/dev

import SocialLogin from "./pages/login/SocialLogin";
import LoginStatus from "./pages/login/LoginStatus";
import MainPage from "./pages/MainPage";
import MyPage from './pages/user/MyPage';
import PlanListPage from "./pages/plans/plan-list/PlanListPage";
import PlanDetailPage from "./pages/plans/plan-detail/PlanDetailPage";
import ChatBotPage from "./pages/chatbot/ChatBotPage";
import OnBoarding from "./pages/login/OnBoarding";
import Logout from "./pages/login/Logout";
import SingleBenefitRegisterForm from "./pages/admin/SingleBenefitRegisterForm";
import BundledBenefitRegisterForm from "./pages/admin/BundledBenefitRegisterForm";


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
        <Route path="/main" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/plans" element={<PlanListPage />} />
        <Route path="/plans/details" element={<PlanDetailPage />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
<<<<<<< HEAD
        <Route path="/mypage/plan" element={<AdminLayout />}>
          <Route path="register" element={<RegisterPlan />} />
          <Route path="delete" element={<DeletePlan />} />
        </Route>
=======
        <Route path="/plans/details/:planId" element={<PlanDetailPage />} />
        <Route path="/admin/benefits/single-benefits" element={<SingleBenefitRegisterForm/>}/>
        <Route path="/admin/benefits/bundled-benefits" element={<BundledBenefitRegisterForm/>}/>
>>>>>>> origin/dev
      </Routes>
    </Router>
  );
}

export default App;
