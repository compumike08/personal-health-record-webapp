import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IDLE_STATUS,
  LOADING_STATUS,
  ERROR_STATUS
} from "../../constants/general";
import {
  createNewPatient,
  getCurrentUserPatientList
} from "../../api/patientAPI";

const initialState = {
  patientsList: [],
  getPatientsListStatus: IDLE_STATUS,
  createNewPatientStatus: IDLE_STATUS
};

export const getCurrentUsersPatientsList = createAsyncThunk(
  "patients/getCurrentUsersPatientsListAction",
  async () => {
    return await getCurrentUserPatientList();
  }
);

export const createPatient = createAsyncThunk(
  "patients/createNewPatientAction",
  async (patientName) => {
    return await createNewPatient(patientName);
  }
);

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUsersPatientsList.pending, (state) => {
        state.getPatientsListStatus = LOADING_STATUS;
      })
      .addCase(getCurrentUsersPatientsList.fulfilled, (state, action) => {
        state.getPatientsListStatus = IDLE_STATUS;
        state.patientsList = Object.assign([], action.payload);
      })
      .addCase(getCurrentUsersPatientsList.rejected, (state) => {
        state.getPatientsListStatus = ERROR_STATUS;
      })
      .addCase(createPatient.pending, (state) => {
        state.createNewPatientStatus = LOADING_STATUS;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.createNewPatientStatus = IDLE_STATUS;
        state.patientsList.push(Object.assign({}, action.payload));
      })
      .addCase(createPatient.rejected, (state) => {
        state.createNewPatientStatus = ERROR_STATUS;
      });
  }
});

const { reducer } = patientsSlice;

export default reducer;
