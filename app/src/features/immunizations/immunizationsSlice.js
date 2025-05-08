import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IDLE_STATUS,
  LOADING_STATUS,
  ERROR_STATUS
} from "../../constants/general";
import {
  getImmunizationsForPatient,
  createNewImmunizationForPatient,
  updateImmunization
} from "../../api/immunizationsAPI";

const initialState = {
  immunizationsList: [],
  getImmunizationsForPatientStatus: IDLE_STATUS,
  createNewImmunizationForPatientStatus: IDLE_STATUS,
  updateImmunizationStatus: IDLE_STATUS
};

export const getImmunizationsForPatientAction = createAsyncThunk(
  "immunizations/getImmunizationsForPatientAction",
  async (patientUuid) => {
    return await getImmunizationsForPatient(patientUuid);
  }
);

export const createNewImmunizationForPatientAction = createAsyncThunk(
  "immunizations/createNewImmunizationForPatientAction",
  async (data) => {
    return await createNewImmunizationForPatient(data);
  }
);

export const updateImmunizationAction = createAsyncThunk(
  "immunizations/updateImmunizationAction",
  async (data) => {
    return await updateImmunization(data);
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
        state.getImmunizationsForPatientStatus = LOADING_STATUS;
      })
      .addCase(getImmunizationsForPatientAction.fulfilled, (state, action) => {
        state.getImmunizationsForPatientStatus = IDLE_STATUS;
        state.immunizationsList = action.payload.map((imz) => {
          return {
            ...imz
          };
        });
      })
      .addCase(getImmunizationsForPatientAction.rejected, (state) => {
        state.getImmunizationsForPatientStatus = ERROR_STATUS;
      })
      .addCase(createNewImmunizationForPatientAction.pending, (state) => {
        state.createNewImmunizationForPatientStatus = LOADING_STATUS;
      })
      .addCase(
        createNewImmunizationForPatientAction.fulfilled,
        (state, action) => {
          state.createNewImmunizationForPatientStatus = IDLE_STATUS;
          state.immunizationsList.push(Object.assign({}, action.payload));
        }
      )
      .addCase(createNewImmunizationForPatientAction.rejected, (state) => {
        state.createNewImmunizationForPatientStatus = ERROR_STATUS;
      })
      .addCase(updateImmunizationAction.pending, (state) => {
        state.updateImmunizationStatus = LOADING_STATUS;
      })
      .addCase(updateImmunizationAction.fulfilled, (state, action) => {
        state.updateImmunizationStatus = IDLE_STATUS;
        const index = state.immunizationsList.findIndex(
          (imz) => imz.immunizationUuid === action.payload.immunizationUuid
        );
        state.immunizationsList[index] = action.payload;
      })
      .addCase(updateImmunizationAction.rejected, (state) => {
        state.updateImmunizationStatus = ERROR_STATUS;
      });
  }
});

const { actions, reducer } = immunizationsSlice;

export const { resetImmunizationsList } = actions;
export default reducer;
