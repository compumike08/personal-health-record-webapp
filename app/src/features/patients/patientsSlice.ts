import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewPatient,
  getCurrentUserPatientList,
  getPatientByPatientUuid
} from "../../api/patientAPI";
import { Patient } from "./patient";

interface PaitentsState {
  patientsList: Patient[];
  currentPatient: Patient | null;
}

const initialState: PaitentsState = {
  patientsList: [],
  currentPatient: null
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
      .addCase(getCurrentUsersPatientsList.fulfilled, (state, action) => {
        state.patientsList = Object.assign([], action.payload);
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.patientsList.push(Object.assign({}, action.payload));
      })
      .addCase(getPatientByPatientUuidAction.fulfilled, (state, action) => {
        state.currentPatient = Object.assign({}, action.payload);
      });
  }
});

const { actions, reducer } = patientsSlice;

export const { resetPatientsData } = actions;
export default reducer;
