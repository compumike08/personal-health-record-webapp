import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAuthData } from "./authSlice";
import { resetPatientsData } from "../patients/patientsSlice";
import { resetMedicationsList } from "../medications/medicationsSlice";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetPatientsData());
    dispatch(resetMedicationsList());
    dispatch(resetAuthData());
    navigate("/");
  }, [dispatch, navigate]);

  return <></>;
};

export default LogoutPage;
