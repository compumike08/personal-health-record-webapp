import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewAllergyForPatient,
  getAllergiesForPatient
} from "../../api/allergiesAPI";
import { Allergy, NewAllergy } from "./allergies";

interface AllergiesState {
  allegiesList: Allergy[];
}

const initialState: AllergiesState = {
  allegiesList: []
};

export const getAllergiesForPatientAction = createAsyncThunk(
  "allergies/getAllergiesForPatientAction",
  async (patientUuid: string) => {
    return await getAllergiesForPatient(patientUuid);
  }
);

export const createNewAllergyForPatientAction = createAsyncThunk(
  "allergies/createNewAllergyForPatientAction",
  async (data: NewAllergy) => {
    return await createNewAllergyForPatient(data);
  }
);

export const allergiesSlice = createSlice({
  name: "allergies",
  initialState,
  reducers: {
    resetAllergiesList(state) {
      state.allegiesList = initialState.allegiesList;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllergiesForPatientAction.fulfilled, (state, action) => {
        state.allegiesList = action.payload.map((alrgy: Allergy) => {
          return {
            ...alrgy
          };
        });
      })
      .addCase(createNewAllergyForPatientAction.fulfilled, (state, action) => {
        state.allegiesList.push(Object.assign({}, action.payload));
      });
  }
});

const { actions, reducer } = allergiesSlice;

export const { resetAllergiesList } = actions;
export default reducer;
