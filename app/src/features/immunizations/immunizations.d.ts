export interface Immunization {
  immunizationUuid: string;
  immunizationName: string;
  immunizationDate: string;
  providerName: string;
  providerLocation: string;
  description: string;
}

export interface NewImmunization {
  patientUuid: string;
  immunizationName: string;
  immunizationDate: string;
  providerName: string;
  providerLocation: string;
  description: string;
}
