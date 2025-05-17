import axios, { AxiosError, AxiosResponse } from "axios";
import { GENERIC_ERR_MSG } from "../constants/general";
import {
  LabResult,
  NewLabResult
} from "../features/labPage/labResults/labResults";

export async function getLabResultsForPatient(
  patientUuid: string
): Promise<LabResult[]> {
  const url = `/api/labResults/patient/${patientUuid}`;

  try {
    const response: AxiosResponse<LabResult[]> = await axios.get(url);
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

export async function createNewLabResult(
  data: NewLabResult
): Promise<LabResult> {
  const url = `/api/labResults/createLabResult`;

  try {
    const response: AxiosResponse<LabResult> = await axios.post(url, data);
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
