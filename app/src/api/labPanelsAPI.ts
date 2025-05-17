import axios, { AxiosError, AxiosResponse } from "axios";
import { GENERIC_ERR_MSG } from "../constants/general";
import { LabPanel, NewLabPanel } from "../features/labPage/labPanels/labPanels";

export async function getLabPanelsForPatient(
  patientUuid: string
): Promise<LabPanel[]> {
  const url = `/api/labPanels/patient/${patientUuid}`;

  try {
    const response: AxiosResponse<LabPanel[]> = await axios.get(url);
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

export async function createNewLabPanel(data: NewLabPanel): Promise<LabPanel> {
  const url = `/api/labPanels/createLabPanel`;

  try {
    const response: AxiosResponse<LabPanel> = await axios.post(url, data);
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
