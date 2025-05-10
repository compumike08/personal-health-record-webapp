import axios, { AxiosError, AxiosResponse } from "axios";
import {
  Immunization,
  NewImmunization
} from "../features/immunizations/immunizations";
import { GENERIC_ERR_MSG } from "../constants/general";

export async function getImmunizationsForPatient(
  patientUuid: string
): Promise<Immunization[]> {
  const url = `/api/immunizations/patient/${patientUuid}`;

  try {
    const response: AxiosResponse<Immunization[]> = await axios.get(url);
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

export async function createNewImmunizationForPatient(
  data: NewImmunization
): Promise<Immunization> {
  const url = `/api/immunizations/createImmunization`;

  try {
    const response: AxiosResponse<Immunization> = await axios.post(url, data);
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

export async function updateImmunization(
  data: Immunization
): Promise<Immunization> {
  const url = `/api/immunizations/immunization`;

  try {
    const response: AxiosResponse<Immunization> = await axios.put(url, data);
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

export async function deleteImmunization(
  immunizationUuid: string
): Promise<Immunization> {
  const url = `/api/immunizations/immunization/${immunizationUuid}`;

  try {
    const response: AxiosResponse<Immunization> = await axios.delete(url);
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
