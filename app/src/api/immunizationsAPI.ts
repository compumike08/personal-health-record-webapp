import axios from "axios";
import {
  Immunization,
  NewImmunization
} from "../features/immunizations/immunizations";

export async function getImmunizationsForPatient(
  patientUuid: string
): Promise<Immunization[]> {
  const url = `/api/immunizations/patient/${patientUuid}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err: any) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    }

    throw new Error(err);
  }
}

export async function createNewImmunizationForPatient(
  data: NewImmunization
): Promise<Immunization> {
  const url = `/api/immunizations/createImmunization`;

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (err: any) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    }

    throw new Error(err);
  }
}

export async function updateImmunization(
  data: Immunization
): Promise<Immunization> {
  const url = `/api/immunizations/immunization`;

  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (err: any) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    }

    throw new Error(err);
  }
}

export async function deleteImmunization(
  immunizationUuid: string
): Promise<Immunization> {
  const url = `/api/immunizations/immunization/${immunizationUuid}`;

  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (err: any) {
    console.log(err);

    if (axios.isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    }

    throw new Error(err);
  }
}
