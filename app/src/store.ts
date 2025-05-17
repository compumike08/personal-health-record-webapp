import { configureStore } from "@reduxjs/toolkit";
import allergiesSlice from "./features/allergies/allergiesSlice";
import authSlice from "./features/auth/authSlice";
import globalSpinnerSlice from "./features/globalSpinner/globalSpinnerSlice";
import immunizationsSlice from "./features/immunizations/immunizationsSlice";
import medicationsSlice from "./features/medications/medicationsSlice";
import patientsSlice from "./features/patients/patientsSlice";
import userProfileSlice from "./features/users/userProfileSlice";
import labResultsSlice from "./features/labPage/labResults/labResultsSlice";
import labPanelsSlice from "./features/labPage/labPanels/labPanelsSlice";

export const store = configureStore({
  reducer: {
    authData: authSlice,
    userProfileData: userProfileSlice,
    patientsData: patientsSlice,
    medicationsData: medicationsSlice,
    immunizationsData: immunizationsSlice,
    globalSpinnerData: globalSpinnerSlice,
    allergiesData: allergiesSlice,
    labResultsData: labResultsSlice,
    labPanelsData: labPanelsSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
