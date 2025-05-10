import axios, { AxiosError, AxiosResponse } from "axios";
import { GENERIC_ERR_MSG } from "../constants/general";
import { Patient } from "../features/patients/patient";

export async function getCurrentUserPatientList(): Promise<Patient[]> {
  const url = `/api/patients/currentUsersPatients`;

  try {
    const response: AxiosResponse<Patient[]> = await axios.get(url);
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

export async function getPatientByPatientUuid(
  patientUuid: string
): Promise<Patient> {
  const url = `/api/patients/patient/${patientUuid}`;

  try {
    const response: AxiosResponse<Patient> = await axios.get(url);
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

export async function createNewPatient(patientName: string): Promise<Patient> {
  const url = `/api/patients/createPatient`;

  try {
    const response: AxiosResponse<Patient> = await axios.post(url, {
      patientName
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
