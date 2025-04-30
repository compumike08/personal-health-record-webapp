import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import userProfileSlice from "./features/users/userProfileSlice";

export const store = configureStore({
  reducer: {
    authData: authSlice,
    userProfileData: userProfileSlice
  }
});
