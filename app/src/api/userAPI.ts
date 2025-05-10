import axios, { AxiosError, AxiosResponse } from "axios";
import { GENERIC_ERR_MSG } from "../constants/general";
import { EditUser, User } from "../features/users/users";

export async function getCurrentUser(): Promise<User> {
  const url = `/api/users/currentUser`;

  try {
    const response: AxiosResponse<User> = await axios.get(url);
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

export async function editCurrentUser(data: EditUser): Promise<User> {
  const url = `/api/users/currentUser/editUser`;

  try {
    const response: AxiosResponse<User> = await axios.post(url, {
      username: data.username,
      email: data.email
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
