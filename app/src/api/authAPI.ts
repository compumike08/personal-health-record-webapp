import axios, { AxiosError, AxiosResponse } from "axios";
import IdTokenVerifier from "idtoken-verifier";
import {
  GENERIC_ERR_MSG,
  TOKEN_SESSION_ATTRIBUTE_NAME
} from "../constants/general";
import { AuthRequest, AuthResponse } from "../features/auth/auth";
import { NewUser, User } from "../features/users/users";

let axiosHeaderInterceptor: number | null = null;

function createJWTToken(token: string) {
  return "Bearer " + token;
}

function isUserLoggedIn() {
  const token = sessionStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME);
  if (token === null) return false;
  return true;
}

function setupAxiosInterceptors(token: string) {
  if (axiosHeaderInterceptor !== null) {
    axios.interceptors.request.eject(axiosHeaderInterceptor);
    axiosHeaderInterceptor = null;
  }

  axiosHeaderInterceptor = axios.interceptors.request.use((config) => {
    if (isUserLoggedIn()) {
      config.headers.authorization = token;
    }
    return config;
  });
}

export function registerSuccessfulLoginForJwt(token: string) {
  const bearerToken = createJWTToken(token);
  sessionStorage.setItem(TOKEN_SESSION_ATTRIBUTE_NAME, bearerToken);
  setupAxiosInterceptors(bearerToken);

  const verifier = new IdTokenVerifier({
    issuer: "phr-webapp",
    audience: "phr-webapp--auth"
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const decodedToken = verifier.decode(token).payload;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const secsUntilExpiration = decodedToken.exp - Math.floor(Date.now() / 1000);

  // The value of 120 represents 120 seconds, or two minutes
  const timerValueForRefresh = secsUntilExpiration - 120;

  // The value of 60 represents 60 seconds, or one minute
  if (timerValueForRefresh < 60) {
    console.log(
      "Unable to set refresh token timer due to token expiring too soon"
    );
    throw new Error("Error setting refresh token timer");
  }

  setTimeout(refreshToken, timerValueForRefresh * 1000);
}

export async function registerUser(data: NewUser): Promise<User> {
  const url = `/api/registerUser`;
  try {
    const response: AxiosResponse<User> = await axios.post(url, {
      username: data.username,
      email: data.email,
      password: data.password
    });
    return response.data;
  } catch (err) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      const error = err as AxiosError<Error>;
      throw new Error(error.response?.data.message);
    }

    throw new Error(GENERIC_ERR_MSG);
  }
}

export async function authenticate(data: AuthRequest): Promise<string> {
  const url = `/api/authenticate`;
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(url, {
      username: data.username,
      password: data.password
    });
    registerSuccessfulLoginForJwt(response.data.token);
    return response.data.token;
  } catch (err) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      const error = err as AxiosError<Error>;
      throw new Error(error.response?.data.message);
    }

    throw new Error(GENERIC_ERR_MSG);
  }
}

export async function refreshToken(): Promise<string> {
  const url = `/api/refresh`;
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(url);
    registerSuccessfulLoginForJwt(response.data.token);
    return response.data.token;
  } catch (err) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      const error = err as AxiosError<Error>;
      throw new Error(error.response?.data.message);
    }

    throw new Error(GENERIC_ERR_MSG);
  }
}

export function logout() {
  sessionStorage.clear();
  if (axiosHeaderInterceptor !== null) {
    axios.interceptors.request.eject(axiosHeaderInterceptor);
    axiosHeaderInterceptor = null;
  }
}
