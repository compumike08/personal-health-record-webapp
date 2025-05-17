import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewLabPanel,
  getLabPanelsForPatient
} from "../../../api/labPanelsAPI";
import { LabPanel, NewLabPanel } from "./labPanels";

interface LabPanelsState {
  labPanelsList: LabPanel[];
}

const initialState: LabPanelsState = {
  labPanelsList: []
};

export const getLabPanelsForPatientAction = createAsyncThunk(
  "labPanels/getLabPanelsForPatientAction",
  async (patientUuid: string) => {
    return await getLabPanelsForPatient(patientUuid);
  }
);

export const createNewLabPanelForPatientAction = createAsyncThunk(
  "labPanels/createNewLabPanelForPatientAction",
  async (data: NewLabPanel) => {
    return await createNewLabPanel(data);
  }
);

export const labPanelsSlice = createSlice({
  name: "labPanels",
  initialState,
  reducers: {
    resetLabPanelsList(state) {
      state.labPanelsList = initialState.labPanelsList;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLabPanelsForPatientAction.fulfilled, (state, action) => {
        state.labPanelsList = action.payload.map((labPanel) => {
          return {
            ...labPanel
          };
        });
      })
      .addCase(createNewLabPanelForPatientAction.fulfilled, (state, action) => {
        state.labPanelsList.push(action.payload);
      });
  }
});

const { actions, reducer } = labPanelsSlice;

export const { resetLabPanelsList } = actions;
export default reducer;
