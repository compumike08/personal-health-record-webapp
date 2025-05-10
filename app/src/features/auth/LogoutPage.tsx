import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetMedicationsList } from "../medications/medicationsSlice";
import { resetPatientsData } from "../patients/patientsSlice";
import { resetAuthData } from "./authSlice";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetPatientsData());
    dispatch(resetMedicationsList());
    dispatch(resetAuthData());
    void navigate("/");
  }, [dispatch, navigate]);

  return <></>;
};

export default LogoutPage;
