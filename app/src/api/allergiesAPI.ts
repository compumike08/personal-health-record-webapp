import axios, { AxiosError, AxiosResponse } from "axios";
import { GENERIC_ERR_MSG } from "../constants/general";
import { Allergy, NewAllergy } from "../features/allergies/allergies";

export async function getAllergiesForPatient(
  patientUuid: string
): Promise<Allergy[]> {
  const url = `/api/allergies/patient/${patientUuid}`;

  try {
    const response: AxiosResponse<Allergy[]> = await axios.get(url);
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

export async function createNewAllergyForPatient(
  data: NewAllergy
): Promise<Allergy> {
  const url = `/api/allergies/createAllergy`;

  try {
    const response: AxiosResponse<Allergy> = await axios.post(url, data);
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

export async function updateAllergy(data: Allergy): Promise<Allergy> {
  const url = `/api/allergies/allergy`;

  try {
    const response: AxiosResponse<Allergy> = await axios.put(url, data);
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

export async function deleteAllergy(allergyUuid: string): Promise<Allergy> {
  const url = `/api/allergies/allergy/${allergyUuid}`;

  try {
    const response: AxiosResponse<Allergy> = await axios.delete(url);
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
