import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IDLE_STATUS,
  LOADING_STATUS,
  ERROR_STATUS
} from "../../constants/general";
import {
  getMedicationsForPatient,
  createNewMedicationForPatient
} from "../../api/medicationsAPI";

const initialState = {
  medicationsList: [],
  getMedicationsForPatientStatus: IDLE_STATUS,
  createNewMedicationForPatientStatus: IDLE_STATUS
};

export const getMedicationsForPatientAction = createAsyncThunk(
  "medications/getMedicationsForPatientAction",
  async (patientUuid) => {
    return await getMedicationsForPatient(patientUuid);
  }
);

export const createNewMedicationForPatientAction = createAsyncThunk(
  "medications/createNewMedicationForPatient",
  async (data) => {
    return await createNewMedicationForPatient(data);
  }
);

export const medicationsSlice = createSlice({
  name: "medications",
  initialState,
  reducers: {
    resetMedicationsList(state) {
      state.medicationsList = initialState.medicationsList;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMedicationsForPatientAction.pending, (state) => {
        state.getMedicationsForPatientStatus = LOADING_STATUS;
      })
      .addCase(getMedicationsForPatientAction.fulfilled, (state, action) => {
        state.getMedicationsForPatientStatus = IDLE_STATUS;
        state.medicationsList = Object.assign([], action.payload);
      })
      .addCase(getMedicationsForPatientAction.rejected, (state) => {
        state.getMedicationsForPatientStatus = ERROR_STATUS;
      })
      .addCase(createNewMedicationForPatientAction.pending, (state) => {
        state.createNewMedicationForPatientStatus = LOADING_STATUS;
      })
      .addCase(
        createNewMedicationForPatientAction.fulfilled,
        (state, action) => {
          state.createNewMedicationForPatientStatus = IDLE_STATUS;
          state.medicationsList.push(Object.assign({}, action.payload));
        }
      )
      .addCase(createNewMedicationForPatientAction.rejected, (state) => {
        state.createNewMedicationForPatientStatus = ERROR_STATUS;
      });
  }
});

const { actions, reducer } = medicationsSlice;

export const { resetMedicationsList } = actions;
export default reducer;
