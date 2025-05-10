import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { editCurrentUser, getCurrentUser } from "../../api/userAPI";
import { RequestStates } from "../../constants/general";
import { EditUser } from "./users";

interface UserProfileState {
  userUuid: string;
  username: string;
  email: string;
  getCurrentUserStatus: RequestStates;
  editCurrentUserStatus: RequestStates;
}

const initialState: UserProfileState = {
  userUuid: "",
  username: "",
  email: "",
  getCurrentUserStatus: RequestStates.IDLE_STATUS,
  editCurrentUserStatus: RequestStates.IDLE_STATUS
};

export const getUserProfileAction = createAsyncThunk(
  "userProfile/getUserProfileAction",
  async () => {
    return await getCurrentUser();
  }
);

export const editUserProfileAction = createAsyncThunk(
  "userProfile/editUserProfileAction",
  async (data: EditUser) => {
    return await editCurrentUser(data);
  }
);

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    resetUserProfile(state) {
      state.userUuid = initialState.userUuid;
      state.username = initialState.username;
      state.email = initialState.email;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfileAction.pending, (state) => {
        state.getCurrentUserStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(getUserProfileAction.fulfilled, (state, action) => {
        state.getCurrentUserStatus = RequestStates.IDLE_STATUS;
        state.userUuid = action.payload.userUuid;
        state.email = action.payload.email;
        state.username = action.payload.username;
      })
      .addCase(getUserProfileAction.rejected, (state) => {
        state.getCurrentUserStatus = RequestStates.ERROR_STATUS;
      })
      .addCase(editUserProfileAction.pending, (state) => {
        state.editCurrentUserStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(editUserProfileAction.fulfilled, (state, action) => {
        state.editCurrentUserStatus = RequestStates.IDLE_STATUS;
        state.userUuid = action.payload.userUuid;
        state.email = action.payload.email;
        state.username = action.payload.username;
      })
      .addCase(editUserProfileAction.rejected, (state) => {
        state.editCurrentUserStatus = RequestStates.ERROR_STATUS;
      });
  }
});

const { reducer } = userProfileSlice;

export default reducer;
