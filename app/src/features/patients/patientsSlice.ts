import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewPatient,
  getCurrentUserPatientList,
  getPatientByPatientUuid
} from "../../api/patientAPI";
import { RequestStates } from "../../constants/general";
import { Patient } from "./patient";

interface PaitentsState {
  patientsList: Patient[];
  currentPatient: Patient | null;
  getPatientsListStatus: RequestStates;
  createNewPatientStatus: RequestStates;
  getCurrentPatientStatus: RequestStates;
}

const initialState: PaitentsState = {
  patientsList: [],
  currentPatient: null,
  getPatientsListStatus: RequestStates.IDLE_STATUS,
  createNewPatientStatus: RequestStates.IDLE_STATUS,
  getCurrentPatientStatus: RequestStates.IDLE_STATUS
};

export const getCurrentUsersPatientsList = createAsyncThunk(
  "patients/getCurrentUsersPatientsListAction",
  async () => {
    return await getCurrentUserPatientList();
  }
);

export const createPatient = createAsyncThunk(
  "patients/createNewPatientAction",
  async (patientName: string) => {
    return await createNewPatient(patientName);
  }
);

export const getPatientByPatientUuidAction = createAsyncThunk(
  "patients/getPatientByPatientUuidAction",
  async (patientUuid: string) => {
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
        state.getPatientsListStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(getCurrentUsersPatientsList.fulfilled, (state, action) => {
        state.getPatientsListStatus = RequestStates.IDLE_STATUS;
        state.patientsList = Object.assign([], action.payload);
      })
      .addCase(getCurrentUsersPatientsList.rejected, (state) => {
        state.getPatientsListStatus = RequestStates.ERROR_STATUS;
      })
      .addCase(createPatient.pending, (state) => {
        state.createNewPatientStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.createNewPatientStatus = RequestStates.IDLE_STATUS;
        state.patientsList.push(Object.assign({}, action.payload));
      })
      .addCase(createPatient.rejected, (state) => {
        state.createNewPatientStatus = RequestStates.ERROR_STATUS;
      })
      .addCase(getPatientByPatientUuidAction.pending, (state) => {
        state.getCurrentPatientStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(getPatientByPatientUuidAction.fulfilled, (state, action) => {
        state.getCurrentPatientStatus = RequestStates.IDLE_STATUS;
        state.currentPatient = Object.assign({}, action.payload);
      })
      .addCase(getPatientByPatientUuidAction.rejected, (state) => {
        state.getCurrentPatientStatus = RequestStates.ERROR_STATUS;
      });
  }
});

const { actions, reducer } = patientsSlice;

export const { resetPatientsData } = actions;
export default reducer;
