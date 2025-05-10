import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewMedicationForPatient,
  deleteMedication,
  getMedicationsForPatient,
  updateMedication
} from "../../api/medicationsAPI";
import { RequestStates } from "../../constants/general";
import { Medication, NewMedication } from "./medications";

interface MedicationsState {
  medicationsList: Medication[];
  getMedicationsForPatientStatus: RequestStates;
  createNewMedicationForPatientStatus: RequestStates;
  deleteMedicationStatus: RequestStates;
  updateMedicationStatus: RequestStates;
}

const initialState: MedicationsState = {
  medicationsList: [],
  getMedicationsForPatientStatus: RequestStates.IDLE_STATUS,
  createNewMedicationForPatientStatus: RequestStates.IDLE_STATUS,
  deleteMedicationStatus: RequestStates.IDLE_STATUS,
  updateMedicationStatus: RequestStates.IDLE_STATUS
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
      .addCase(getMedicationsForPatientAction.pending, (state) => {
        state.getMedicationsForPatientStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(getMedicationsForPatientAction.fulfilled, (state, action) => {
        state.getMedicationsForPatientStatus = RequestStates.IDLE_STATUS;
        state.medicationsList = action.payload.map((med) => {
          return {
            ...med
          };
        });
      })
      .addCase(getMedicationsForPatientAction.rejected, (state) => {
        state.getMedicationsForPatientStatus = RequestStates.ERROR_STATUS;
      })
      .addCase(createNewMedicationForPatientAction.pending, (state) => {
        state.createNewMedicationForPatientStatus =
          RequestStates.LOADING_STATUS;
      })
      .addCase(
        createNewMedicationForPatientAction.fulfilled,
        (state, action) => {
          state.createNewMedicationForPatientStatus = RequestStates.IDLE_STATUS;
          state.medicationsList.push(Object.assign({}, action.payload));
        }
      )
      .addCase(createNewMedicationForPatientAction.rejected, (state) => {
        state.createNewMedicationForPatientStatus = RequestStates.ERROR_STATUS;
      })
      .addCase(updateMedicationAction.pending, (state) => {
        state.updateMedicationStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(updateMedicationAction.fulfilled, (state, action) => {
        state.updateMedicationStatus = RequestStates.IDLE_STATUS;
        const index = state.medicationsList.findIndex(
          (med) => med.medicationUuid === action.payload.medicationUuid
        );
        state.medicationsList[index] = action.payload;
      })
      .addCase(updateMedicationAction.rejected, (state) => {
        state.updateMedicationStatus = RequestStates.ERROR_STATUS;
      })
      .addCase(deleteMedicationAction.pending, (state) => {
        state.deleteMedicationStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(deleteMedicationAction.fulfilled, (state, action) => {
        state.deleteMedicationStatus = RequestStates.IDLE_STATUS;
        const index = state.medicationsList.findIndex(
          (med) => med.medicationUuid === action.payload.medicationUuid
        );
        state.medicationsList.splice(index, 1);
      })
      .addCase(deleteMedicationAction.rejected, (state) => {
        state.deleteMedicationStatus = RequestStates.ERROR_STATUS;
      });
  }
});

const { actions, reducer } = medicationsSlice;

export const { resetMedicationsList } = actions;
export default reducer;
