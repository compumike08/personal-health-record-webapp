export interface LabResult {
  labResultUuid: string;
  labResultName: string;
  labResultDate: string;
  labResultProviderName: string;
  labResultProviderLocation: string;
  labResultValue: string;
  labResultReferenceRange: string;
  labResultNotes: string;
  labPanelUuid: string | null;
}

export interface NewLabResult {
  labResultName: string;
  labResultDate: string;
  labResultProviderName: string;
  labResultProviderLocation: string;
  labResultValue: string;
  labResultReferenceRange: string;
  labResultNotes: string;
  patientUuid: string;
}
