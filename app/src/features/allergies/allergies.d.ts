export interface Allergy {
  allergyUuid: string;
  allergyName: string;
  isCurrentAllergy: boolean;
  allergyStartedDate: string;
  allergyEndedDate: string;
  description: string;
}

export interface NewAllergy {
  allergyName: string;
  isCurrentAllergy: boolean;
  allergyStartedDate: string;
  allergyEndedDate: string;
  description: string;
  patientUuid: string;
}
