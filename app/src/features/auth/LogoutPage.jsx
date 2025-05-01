import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAuthData } from "./authSlice";
import { resetCurrentPatient } from "../patients/patientsSlice";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetCurrentPatient());
    dispatch(resetAuthData());
    navigate("/");
  }, []);

  return <></>;
};

export default LogoutPage;
