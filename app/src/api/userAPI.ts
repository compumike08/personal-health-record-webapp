import axios from "axios";
import { EditUser, User } from "../features/users/users";
import { GENERIC_ERR_MSG } from "../constants/general";

export async function getCurrentUser(): Promise<User> {
  const url = `/api/users/currentUser`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    }

    throw new Error(GENERIC_ERR_MSG);
  }
}

export async function editCurrentUser(data: EditUser): Promise<User> {
  const url = `/api/users/currentUser/editUser`;

  try {
    const response = await axios.post(url, {
      username: data.username,
      email: data.email
    });
    return response.data;
  } catch (err) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    }

    throw new Error(GENERIC_ERR_MSG);
  }
}
