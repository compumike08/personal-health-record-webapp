import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IDLE_STATUS,
  LOADING_STATUS,
  ERROR_STATUS
} from "../../constants/general";
import {
  createNewPatient,
  getCurrentUserPatientList,
  getPatientByPatientUuid
} from "../../api/patientAPI";

const initialState = {
  patientsList: [],
  currentPatient: null,
  getPatientsListStatus: IDLE_STATUS,
  createNewPatientStatus: IDLE_STATUS,
  getCurrentPatientStatus: IDLE_STATUS
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

export const getPatientByPatientUuidAction = createAsyncThunk(
  "patients/getPatientByPatientUuidAction",
  async (patientUuid) => {
    return await getPatientByPatientUuid(patientUuid);
  }
);

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    resetPatientsData(state) {
      state.currentPatient = initialState.currentPatient;
      state.patientsList = initialState.patientsList;
    }
  },
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
      })
      .addCase(getPatientByPatientUuidAction.pending, (state) => {
        state.getCurrentPatientStatus = LOADING_STATUS;
      })
      .addCase(getPatientByPatientUuidAction.fulfilled, (state, action) => {
        state.getCurrentPatientStatus = IDLE_STATUS;
        state.currentPatient = Object.assign({}, action.payload);
      })
      .addCase(getPatientByPatientUuidAction.rejected, (state) => {
        state.getCurrentPatientStatus = ERROR_STATUS;
      });
  }
});

const { actions, reducer } = patientsSlice;

export const { resetPatientsData } = actions;
export default reducer;
