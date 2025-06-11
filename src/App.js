import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/kakao-login";
import LoginStatus from "./pages/LoginStatus";
import MainPage from "./pages/MainPage";
import OnBoarding from "./pages/OnBoarding";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login/status" element={<LoginStatus />} />{" "}
        <Route path="/mainPage" element={<MainPage />} />{" "}
        <Route path="/onBoarding" element={<OnBoarding />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
