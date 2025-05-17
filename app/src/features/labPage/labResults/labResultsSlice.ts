import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LabResult, NewLabResult } from "./labResults";
import {
  createNewLabResult,
  getLabResultsForPatient
} from "../../../api/labResultsAPI";
import { createNewLabPanelForPatientAction } from "../labPanels/labPanelsSlice";

interface LabResultsState {
  labResultsList: LabResult[];
}

const initialState: LabResultsState = {
  labResultsList: []
};

export const getLabResultsForPatientAction = createAsyncThunk(
  "labResults/getLabResultsForPatientAction",
  async (patientUuid: string) => {
    return await getLabResultsForPatient(patientUuid);
  }
);

export const createNewLabResultForPatientAction = createAsyncThunk(
  "labResults/createNewLabResultForPatientAction",
  async (data: NewLabResult) => {
    return await createNewLabResult(data);
  }
);

export const labResultsSlice = createSlice({
  name: "labResults",
  initialState,
  reducers: {
    resetLabResultsList(state) {
      state.labResultsList = initialState.labResultsList;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLabResultsForPatientAction.fulfilled, (state, action) => {
        state.labResultsList = action.payload.map((labResult) => {
          return {
            ...labResult
          };
        });
      })
      .addCase(
        createNewLabResultForPatientAction.fulfilled,
        (state, action) => {
          state.labResultsList.push(action.payload);
        }
      )
      .addCase(createNewLabPanelForPatientAction.fulfilled, (state, action) => {
        action.payload.labResultsList.forEach((labResult) => {
          state.labResultsList.push(labResult);
        });
      });
  }
});

const { actions, reducer } = labResultsSlice;

export const { resetLabResultsList } = actions;
export default reducer;
