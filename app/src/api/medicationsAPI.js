import axios from "axios";

export async function getMedicationsForPatient(patientUuid) {
  const url = `/api/medications/patient/${patientUuid}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function createNewMedicationForPatient(data) {
  const url = `/api/medications/createMedication`;

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function updateMedication(data) {
  const url = `/api/medications/medication`;

  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}

export async function deleteMedication(medicationUuid) {
  const url = `/api/medications/medication/${medicationUuid}`;

  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response.data.message);
  }
}
