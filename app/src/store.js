import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import userProfileSlice from "./features/users/userProfileSlice";
import patientsSlice from "./features/patients/patientsSlice";
import medicationsSlice from "./features/medications/medicationsSlice";
import immunizationsSlice from "./features/immunizations/immunizationsSlice";

export const store = configureStore({
  reducer: {
    authData: authSlice,
    userProfileData: userProfileSlice,
    patientsData: patientsSlice,
    medicationsData: medicationsSlice,
    immunizationsData: immunizationsSlice
  }
});
