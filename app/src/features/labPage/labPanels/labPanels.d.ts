import { LabResult, NewLabResult } from "../labResults/labResults";

export interface LabPanel {
  labPanelUuid: string;
  labPanelName: string;
  labResultsList: LabResult[];
}

export interface NewLabPanel {
  labPanelName: string;
  patientUuid: string;
  labResultsList: NewLabResult[];
}
