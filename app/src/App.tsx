import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthLanding from "./features/auth/AuthLanding";
import LoginPage from "./features/auth/LoginPage";
import LogoutPage from "./features/auth/LogoutPage";
import RegisterUser from "./features/auth/RegisterUser";
import GlobalSpinner from "./features/globalSpinner/GlobalSpinner";
import HomePage from "./features/home/HomePage";
import ImmunizationsPage from "./features/immunizations/ImmunizationsPage";
import MedicationsPage from "./features/medications/MedicationsPage";
import NewPatient from "./features/patients/NewPatient";
import TitleBar from "./features/TitleBar/TitleBar";
import UserProfile from "./features/users/UserProfile";

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
        <GlobalSpinner />
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
