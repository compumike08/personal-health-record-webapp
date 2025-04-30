import axios from "axios";

export async function getCurrentUserPatientList() {
  const url = `/api/patients/currentUsersPatients`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function getPatientByPatientUuid(patientUuid) {
  const url = `/api/patients/patient/${patientUuid}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function createNewPatient(patientName) {
  const url = `/api/patients/createPatient`;

  try {
    const response = await axios.post(url, {
      patientName
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}
