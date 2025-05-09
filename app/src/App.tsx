import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthLanding from "./features/auth/AuthLanding";
import RegisterUser from "./features/auth/RegisterUser";
import LoginPage from "./features/auth/LoginPage";
import TitleBar from "./features/TitleBar/TitleBar";
import HomePage from "./features/home/HomePage";
import LogoutPage from "./features/auth/LogoutPage";
import UserProfile from "./features/users/UserProfile";
import NewPatient from "./features/patients/NewPatient";
import MedicationsPage from "./features/medications/MedicationsPage";
import ImmunizationsPage from "./features/immunizations/ImmunizationsPage";

import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="content">
        <ToastContainer
          position="top-center"
          newestOnTop
          limit={3}
          autoClose={3000}
        />
        <TitleBar />
        <Routes>
          <Route path="/" element={<AuthLanding />} />
          <Route path="/registerUser" element={<RegisterUser />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/newPatient" element={<NewPatient />} />
          <Route path="/immunizations" element={<ImmunizationsPage />} />
          <Route path="/medications" element={<MedicationsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
