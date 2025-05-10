import axios, { AxiosError, AxiosResponse } from "axios";
import { GENERIC_ERR_MSG } from "../constants/general";
import { Medication, NewMedication } from "../features/medications/medications";

export async function getMedicationsForPatient(
  patientUuid: string
): Promise<Medication[]> {
  const url = `/api/medications/patient/${patientUuid}`;

  try {
    const response: AxiosResponse<Medication[]> = await axios.get(url);
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

export async function createNewMedicationForPatient(
  data: NewMedication
): Promise<Medication> {
  const url = `/api/medications/createMedication`;

  try {
    const response: AxiosResponse<Medication> = await axios.post(url, data);
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

export async function updateMedication(data: Medication): Promise<Medication> {
  const url = `/api/medications/medication`;

  try {
    const response: AxiosResponse<Medication> = await axios.put(url, data);
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

export async function deleteMedication(
  medicationUuid: string
): Promise<Medication> {
  const url = `/api/medications/medication/${medicationUuid}`;

  try {
    const response: AxiosResponse<Medication> = await axios.delete(url);
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
