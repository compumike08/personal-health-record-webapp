import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import userProfileSlice from "./features/users/userProfileSlice";
import patientsSlice from "./features/patients/patientsSlice";

export const store = configureStore({
  reducer: {
    authData: authSlice,
    userProfileData: userProfileSlice,
    patientsData: patientsSlice
  }
});
