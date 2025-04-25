import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLanding from "./features/auth/AuthLanding";
import RegisterUser from "./features/auth/RegisterUser";
import LoginPage from "./features/auth/LoginPage";

import "./App.css";
import TitleBar from "./features/TitleBar/TitleBar";
import HomePage from "./features/home/HomePage";
import LogoutPage from "./features/auth/LogoutPage";

const App = () => {
  return (
    <Router>
      <div className="content">
        <TitleBar />
        <Routes>
          <Route exact path="/" element={<AuthLanding />} />
          <Route path="/registerUser" element={<RegisterUser />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
