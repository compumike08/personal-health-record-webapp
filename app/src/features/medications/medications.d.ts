export interface Medication {
  medicationUuid: string;
  medicationName: string;
  isCurrentlyTaking: boolean;
  medicationStartDate: string | null;
  medicationEndDate: string | null;
  dosage: number | null;
  dosageUnit: string | null;
  notes: string | null;
}

export interface NewMedication {
  patientUuid: string;
  medicationName: string;
  isCurrentlyTaking: boolean;
  medicationStartDate: string | null;
  medicationEndDate: string | null;
  dosage: number | null;
  dosageUnit: string | null;
  notes: string | null;
}
