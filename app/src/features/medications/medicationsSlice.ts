import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewMedicationForPatient,
  deleteMedication,
  getMedicationsForPatient,
  updateMedication
} from "../../api/medicationsAPI";
import { Medication, NewMedication } from "./medications";

interface MedicationsState {
  medicationsList: Medication[];
}

const initialState: MedicationsState = {
  medicationsList: []
};

export const getMedicationsForPatientAction = createAsyncThunk(
  "medications/getMedicationsForPatientAction",
  async (patientUuid: string) => {
    return await getMedicationsForPatient(patientUuid);
  }
);

export const createNewMedicationForPatientAction = createAsyncThunk(
  "medications/createNewMedicationForPatientAction",
  async (data: NewMedication) => {
    return await createNewMedicationForPatient(data);
  }
);

export const updateMedicationAction = createAsyncThunk(
  "medications/updateMedicationAction",
  async (data: Medication) => {
    return await updateMedication(data);
  }
);

export const deleteMedicationAction = createAsyncThunk(
  "medications/deleteMedicationAction",
  async (medicationUuid: string) => {
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
      .addCase(getMedicationsForPatientAction.fulfilled, (state, action) => {
        state.medicationsList = action.payload.map((med) => {
          return {
            ...med
          };
        });
      })
      .addCase(
        createNewMedicationForPatientAction.fulfilled,
        (state, action) => {
          state.medicationsList.push(Object.assign({}, action.payload));
        }
      )
      .addCase(updateMedicationAction.fulfilled, (state, action) => {
        const index = state.medicationsList.findIndex(
          (med) => med.medicationUuid === action.payload.medicationUuid
        );
        state.medicationsList[index] = action.payload;
      })
      .addCase(deleteMedicationAction.fulfilled, (state, action) => {
        const index = state.medicationsList.findIndex(
          (med) => med.medicationUuid === action.payload.medicationUuid
        );
        state.medicationsList.splice(index, 1);
      });
  }
});

const { actions, reducer } = medicationsSlice;

export const { resetMedicationsList } = actions;
export default reducer;
