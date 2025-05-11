import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authenticate, logout, registerUser } from "../../api/authAPI";
import { NewUser } from "../users/users";
import { AuthRequest } from "./auth";

interface AuthState {
  isUserLoggedIn: boolean;
}

const initialState: AuthState = {
  isUserLoggedIn: false
};

export const registerUserAction = createAsyncThunk(
  "auth/registerUserAction",
  async (data: NewUser) => {
    return await registerUser(data);
  }
);

export const loginAction = createAsyncThunk(
  "auth/loginAction",
  async (data: AuthRequest) => {
    return await authenticate(data);
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthData() {
      logout();
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginAction.fulfilled, (state) => {
      state.isUserLoggedIn = true;
    });
  }
});

const { actions, reducer } = authSlice;

export const { resetAuthData } = actions;

export default reducer;
