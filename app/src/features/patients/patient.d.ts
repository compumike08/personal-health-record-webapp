import { UserNoPatientList } from "../users/users";

export interface Patient {
  patientUuid: string;
  patientName: string;
  usersList: UserNoPatientList[];
}
