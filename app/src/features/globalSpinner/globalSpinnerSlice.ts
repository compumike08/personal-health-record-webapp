import { Action, createSlice } from "@reduxjs/toolkit";

interface GlobalSpinnerState {
  loading: boolean;
}

const initialState: GlobalSpinnerState = {
  loading: false
};

const globalSpinnerSlice = createSlice({
  name: "globalSpinner",
  initialState,
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action: Action) => action.type.includes("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action: Action) => action.type.includes("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action: Action) => action.type.includes("/rejected"),
        (state) => {
          state.loading = false;
        }
      );
  },
  reducers: {}
});

export default globalSpinnerSlice.reducer;
