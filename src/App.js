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
import OnBoarding from "./pages/OnBoarding";
import Logout from "./pages/Logout";
import PlanListPage from "./components/PlanListPage";

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
