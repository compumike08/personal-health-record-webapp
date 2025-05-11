import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAllergiesList } from "../allergies/allergiesSlice";
import { resetImmunizationsList } from "../immunizations/immunizationsSlice";
import { resetMedicationsList } from "../medications/medicationsSlice";
import { resetPatientsData } from "../patients/patientsSlice";
import { resetUserProfile } from "../users/userProfileSlice";
import { resetAuthData } from "./authSlice";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetPatientsData());
    dispatch(resetMedicationsList());
    dispatch(resetImmunizationsList());
    dispatch(resetAllergiesList());
    dispatch(resetAuthData());
    dispatch(resetUserProfile());
    void navigate("/");
  }, [dispatch, navigate]);

  return <></>;
};

export default LogoutPage;
