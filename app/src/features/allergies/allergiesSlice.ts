import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewAllergyForPatient,
  deleteAllergy,
  getAllergiesForPatient,
  updateAllergy
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

export const updateAllergyAction = createAsyncThunk(
  "allergies/updateAllergyAction",
  async (data: Allergy) => {
    return await updateAllergy(data);
  }
);

export const deleteAllergyAction = createAsyncThunk(
  "allergies/deleteAllergyAction",
  async (allergyUuid: string) => {
    return await deleteAllergy(allergyUuid);
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
      })
      .addCase(updateAllergyAction.fulfilled, (state, action) => {
        const index = state.allegiesList.findIndex(
          (alrgy) => alrgy.allergyUuid === action.payload.allergyUuid
        );
        state.allegiesList[index] = action.payload;
      })
      .addCase(deleteAllergyAction.fulfilled, (state, action) => {
        const index = state.allegiesList.findIndex(
          (alrgy) => alrgy.allergyUuid === action.payload.allergyUuid
        );
        state.allegiesList.splice(index, 1);
      });
  }
});

const { actions, reducer } = allergiesSlice;

export const { resetAllergiesList } = actions;
export default reducer;
