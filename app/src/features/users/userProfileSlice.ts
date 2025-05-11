import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { editCurrentUser, getCurrentUser } from "../../api/userAPI";
import { EditUser } from "./users";

interface UserProfileState {
  userUuid: string;
  username: string;
  email: string;
}

const initialState: UserProfileState = {
  userUuid: "",
  username: "",
  email: ""
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
      .addCase(getUserProfileAction.fulfilled, (state, action) => {
        state.userUuid = action.payload.userUuid;
        state.email = action.payload.email;
        state.username = action.payload.username;
      })
      .addCase(editUserProfileAction.fulfilled, (state, action) => {
        state.userUuid = action.payload.userUuid;
        state.email = action.payload.email;
        state.username = action.payload.username;
      });
  }
});

const { actions, reducer } = userProfileSlice;

export const { resetUserProfile } = actions;

export default reducer;
