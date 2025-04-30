import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IDLE_STATUS,
  LOADING_STATUS,
  ERROR_STATUS
} from "../../constants/general";
import { getCurrentUser, editCurrentUser } from "../../api/userAPI";

const initialState = {
  userUuid: "",
  username: "",
  email: "",
  getCurrentUserStatus: IDLE_STATUS,
  editCurrentUserStatus: IDLE_STATUS
};

export const getUserProfileAction = createAsyncThunk(
  "userProfile/getUserProfileAction",
  async () => {
    return await getCurrentUser();
  }
);

export const editUserProfileAction = createAsyncThunk(
  "userProfile/editUserProfileAction",
  async (data) => {
    return await editCurrentUser(data);
  }
);

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfileAction.pending, (state) => {
        state.getCurrentUserStatus = LOADING_STATUS;
      })
      .addCase(getUserProfileAction.fulfilled, (state, action) => {
        state.getCurrentUserStatus = IDLE_STATUS;
        state.userUuid = action.payload.userUuid;
        state.email = action.payload.email;
        state.username = action.payload.username;
      })
      .addCase(getUserProfileAction.rejected, (state) => {
        state.getCurrentUserStatus = ERROR_STATUS;
      })
      .addCase(editUserProfileAction.pending, (state) => {
        state.editCurrentUserStatus = LOADING_STATUS;
      })
      .addCase(editUserProfileAction.fulfilled, (state, action) => {
        state.editCurrentUserStatus = IDLE_STATUS;
        state.userUuid = action.payload.userUuid;
        state.email = action.payload.email;
        state.username = action.payload.username;
      })
      .addCase(editUserProfileAction.rejected, (state) => {
        state.editCurrentUserStatus = ERROR_STATUS;
      });
  }
});

const { reducer } = userProfileSlice;

export default reducer;
