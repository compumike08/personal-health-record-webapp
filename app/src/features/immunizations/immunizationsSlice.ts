import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewImmunizationForPatient,
  deleteImmunization,
  getImmunizationsForPatient,
  updateImmunization
} from "../../api/immunizationsAPI";
import { RequestStates } from "../../constants/general";
import { Immunization, NewImmunization } from "./immunizations";

interface ImmunizationsState {
  immunizationsList: Immunization[];
  getImmunizationsForPatientStatus: RequestStates;
  createNewImmunizationForPatientStatus: RequestStates;
  updateImmunizationStatus: RequestStates;
  deleteImmunizationStatus: RequestStates;
}

const initialState: ImmunizationsState = {
  immunizationsList: [],
  getImmunizationsForPatientStatus: RequestStates.IDLE_STATUS,
  createNewImmunizationForPatientStatus: RequestStates.IDLE_STATUS,
  updateImmunizationStatus: RequestStates.IDLE_STATUS,
  deleteImmunizationStatus: RequestStates.IDLE_STATUS
};

export const getImmunizationsForPatientAction = createAsyncThunk(
  "immunizations/getImmunizationsForPatientAction",
  async (patientUuid: string) => {
    return await getImmunizationsForPatient(patientUuid);
  }
);

export const createNewImmunizationForPatientAction = createAsyncThunk(
  "immunizations/createNewImmunizationForPatientAction",
  async (data: NewImmunization) => {
    return await createNewImmunizationForPatient(data);
  }
);

export const updateImmunizationAction = createAsyncThunk(
  "immunizations/updateImmunizationAction",
  async (data: Immunization) => {
    return await updateImmunization(data);
  }
);

export const deleteImmunizationAction = createAsyncThunk(
  "immunizations/deleteImmunizationAction",
  async (immunizationUuid: string) => {
    return await deleteImmunization(immunizationUuid);
  }
);

export const immunizationsSlice = createSlice({
  name: "immunizations",
  initialState,
  reducers: {
    resetImmunizationsList(state) {
      state.immunizationsList = initialState.immunizationsList;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getImmunizationsForPatientAction.pending, (state) => {
        state.getImmunizationsForPatientStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(getImmunizationsForPatientAction.fulfilled, (state, action) => {
        state.getImmunizationsForPatientStatus = RequestStates.IDLE_STATUS;
        state.immunizationsList = action.payload.map((imz: Immunization) => {
          return {
            ...imz
          };
        });
      })
      .addCase(getImmunizationsForPatientAction.rejected, (state) => {
        state.getImmunizationsForPatientStatus = RequestStates.ERROR_STATUS;
      })
      .addCase(createNewImmunizationForPatientAction.pending, (state) => {
        state.createNewImmunizationForPatientStatus =
          RequestStates.LOADING_STATUS;
      })
      .addCase(
        createNewImmunizationForPatientAction.fulfilled,
        (state, action) => {
          state.createNewImmunizationForPatientStatus =
            RequestStates.IDLE_STATUS;
          state.immunizationsList.push(Object.assign({}, action.payload));
        }
      )
      .addCase(createNewImmunizationForPatientAction.rejected, (state) => {
        state.createNewImmunizationForPatientStatus =
          RequestStates.ERROR_STATUS;
      })
      .addCase(updateImmunizationAction.pending, (state) => {
        state.updateImmunizationStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(updateImmunizationAction.fulfilled, (state, action) => {
        state.updateImmunizationStatus = RequestStates.IDLE_STATUS;
        const index = state.immunizationsList.findIndex(
          (imz) => imz.immunizationUuid === action.payload.immunizationUuid
        );
        state.immunizationsList[index] = action.payload;
      })
      .addCase(updateImmunizationAction.rejected, (state) => {
        state.updateImmunizationStatus = RequestStates.ERROR_STATUS;
      })
      .addCase(deleteImmunizationAction.pending, (state) => {
        state.deleteImmunizationStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(deleteImmunizationAction.fulfilled, (state, action) => {
        state.deleteImmunizationStatus = RequestStates.IDLE_STATUS;
        const index = state.immunizationsList.findIndex(
          (imz) => imz.immunizationUuid === action.payload.immunizationUuid
        );
        state.immunizationsList.splice(index, 1);
      })
      .addCase(deleteImmunizationAction.rejected, (state) => {
        state.deleteImmunizationStatus = RequestStates.ERROR_STATUS;
      });
  }
});

const { actions, reducer } = immunizationsSlice;

export const { resetImmunizationsList } = actions;
export default reducer;
