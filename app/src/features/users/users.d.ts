import { Patient } from "../patients/patient";

export enum UserRoles {
  ROLE_USER
}

export interface User {
  userUuid: string;
  username: string;
  email: string;
  roles: UserRoles[];
  patientList: Patient[];
}

export interface UserNoPatientList {
  userUuid: string;
  username: string;
  email: string;
  roles: UserRoles[];
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface EditUser {
  username: string;
  email: string;
}
