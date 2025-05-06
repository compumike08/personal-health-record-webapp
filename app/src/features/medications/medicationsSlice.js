import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IDLE_STATUS,
  LOADING_STATUS,
  ERROR_STATUS
} from "../../constants/general";
import {
  getMedicationsForPatient,
  createNewMedicationForPatient,
  deleteMedication,
  updateMedication
} from "../../api/medicationsAPI";

const initialState = {
  medicationsList: [],
  getMedicationsForPatientStatus: IDLE_STATUS,
  createNewMedicationForPatientStatus: IDLE_STATUS,
  deleteMedicationStatus: IDLE_STATUS,
  updateMedicationStatus: IDLE_STATUS
};

export const getMedicationsForPatientAction = createAsyncThunk(
  "medications/getMedicationsForPatientAction",
  async (patientUuid) => {
    return await getMedicationsForPatient(patientUuid);
  }
);

export const createNewMedicationForPatientAction = createAsyncThunk(
  "medications/createNewMedicationForPatientAction",
  async (data) => {
    return await createNewMedicationForPatient(data);
  }
);

export const updateMedicationAction = createAsyncThunk(
  "medications/updateMedicationAction",
  async (data) => {
    return await updateMedication(data);
  }
);

export const deleteMedicationAction = createAsyncThunk(
  "medications/deleteMedicationAction",
  async (medicationUuid) => {
    return await deleteMedication(medicationUuid);
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
        state.medicationsList = action.payload.map((med) => {
          return {
            ...med
          };
        });
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
      })
      .addCase(updateMedicationAction.pending, (state) => {
        state.updateMedicationStatus = LOADING_STATUS;
      })
      .addCase(updateMedicationAction.fulfilled, (state, action) => {
        state.updateMedicationStatus = IDLE_STATUS;
        const index = state.medicationsList.findIndex(
          (med) => med.medicationUuid === action.payload.medicationUuid
        );
        state.medicationsList[index] = action.payload;
      })
      .addCase(updateMedicationAction.rejected, (state) => {
        state.updateMedicationStatus = ERROR_STATUS;
      })
      .addCase(deleteMedicationAction.pending, (state) => {
        state.deleteMedicationStatus = LOADING_STATUS;
      })
      .addCase(deleteMedicationAction.fulfilled, (state, action) => {
        state.deleteMedicationStatus = IDLE_STATUS;
        const index = state.medicationsList.findIndex(
          (med) => med.medicationUuid === action.payload.medicationUuid
        );
        state.medicationsList.splice(index, 1);
      })
      .addCase(deleteMedicationAction.rejected, (state) => {
        state.deleteMedicationStatus = ERROR_STATUS;
      });
  }
});

const { actions, reducer } = medicationsSlice;

export const { resetMedicationsList } = actions;
export default reducer;
