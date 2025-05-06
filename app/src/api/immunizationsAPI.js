import axios from "axios";

export async function getImmunizationsForPatient(patientUuid) {
  const url = `/api/immunizations/patient/${patientUuid}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function createNewImmunizationForPatient(data) {
  const url = `/api/immunizations/createImmunization`;

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}
