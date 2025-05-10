import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authenticate, logout, registerUser } from "../../api/authAPI";
import { RequestStates } from "../../constants/general";
import { NewUser } from "../users/users";
import { AuthRequest } from "./auth";

interface AuthState {
  isUserLoggedIn: boolean;
  registerUserStatus: RequestStates;
  loginStatus: RequestStates;
}

const initialState: AuthState = {
  isUserLoggedIn: false,
  registerUserStatus: RequestStates.IDLE_STATUS,
  loginStatus: RequestStates.IDLE_STATUS
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
    builder
      .addCase(registerUserAction.pending, (state) => {
        state.registerUserStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(registerUserAction.fulfilled, (state) => {
        state.registerUserStatus = RequestStates.IDLE_STATUS;
      })
      .addCase(registerUserAction.rejected, (state) => {
        state.registerUserStatus = RequestStates.ERROR_STATUS;
      })
      .addCase(loginAction.pending, (state) => {
        state.loginStatus = RequestStates.LOADING_STATUS;
      })
      .addCase(loginAction.fulfilled, (state) => {
        state.loginStatus = RequestStates.IDLE_STATUS;
        state.isUserLoggedIn = true;
      })
      .addCase(loginAction.rejected, (state) => {
        state.loginStatus = RequestStates.ERROR_STATUS;
      });
  }
});

const { actions, reducer } = authSlice;

export const { resetAuthData } = actions;

export default reducer;
