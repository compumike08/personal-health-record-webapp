import axios from "axios";
import { EditUser, User } from "../features/users/users";

export async function getCurrentUser(): Promise<User> {
  const url = `/api/users/currentUser`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err: any) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    }

    throw new Error(err);
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
  } catch (err: any) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    }

    throw new Error(err);
  }
}
