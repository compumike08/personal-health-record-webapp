import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewImmunizationForPatient,
  deleteImmunization,
  getImmunizationsForPatient,
  updateImmunization
} from "../../api/immunizationsAPI";
import { Immunization, NewImmunization } from "./immunizations";

interface ImmunizationsState {
  immunizationsList: Immunization[];
}

const initialState: ImmunizationsState = {
  immunizationsList: []
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
      .addCase(getImmunizationsForPatientAction.fulfilled, (state, action) => {
        state.immunizationsList = action.payload.map((imz: Immunization) => {
          return {
            ...imz
          };
        });
      })
      .addCase(
        createNewImmunizationForPatientAction.fulfilled,
        (state, action) => {
          state.immunizationsList.push(Object.assign({}, action.payload));
        }
      )
      .addCase(updateImmunizationAction.fulfilled, (state, action) => {
        const index = state.immunizationsList.findIndex(
          (imz) => imz.immunizationUuid === action.payload.immunizationUuid
        );
        state.immunizationsList[index] = action.payload;
      })
      .addCase(deleteImmunizationAction.fulfilled, (state, action) => {
        const index = state.immunizationsList.findIndex(
          (imz) => imz.immunizationUuid === action.payload.immunizationUuid
        );
        state.immunizationsList.splice(index, 1);
      });
  }
});

const { actions, reducer } = immunizationsSlice;

export const { resetImmunizationsList } = actions;
export default reducer;
