import axios from "axios";

export async function getCurrentUser() {
  const url = `/api/users/currentUser`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function editCurrentUser(data) {
  const url = `/api/users/currentUser/editUser`;

  try {
    const response = await axios.post(url, {
      username: data.username,
      email: data.email
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}
