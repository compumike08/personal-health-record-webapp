import { useState } from "react";
import { createSelector, SerializedError } from "@reduxjs/toolkit";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import MedicationsList from "./MedicationsList";
import { deleteMedicationAction } from "./medicationsSlice";
import NewUpdateMedication from "./NewUpdateMedication";

const MedicationsPage = () => {
  const dispatch = useAppDispatch();

  const [selectedCurrentMedUuid, setSelectedCurrentMedUuid] = useState<
    string | null
  >(null);

  const selectMedicationsList = (state: RootState) =>
    state.medicationsData.medicationsList;
  const selectCurrentMedicationUuid = (
    _state: RootState,
    currentMedicationUuid: string | null
  ) => currentMedicationUuid;

  const selectCurrentMedication = createSelector(
    [selectMedicationsList, selectCurrentMedicationUuid],
    (medicationsList, currentMedicationUuid) => {
      if (selectedCurrentMedUuid === null) {
        return null;
      }

      const index = medicationsList.findIndex(
        (med) => med.medicationUuid === currentMedicationUuid
      );
      return medicationsList[index];
    }
  );

  const currentMedication = useAppSelector((state) =>
    selectCurrentMedication(state, selectedCurrentMedUuid)
  );

  const onUpdateMedication = (medicationUuid: string) => {
    setSelectedCurrentMedUuid(medicationUuid);
  };

  const submitComplete = () => {
    setSelectedCurrentMedUuid(null);
  };

  const onDeleteMedication = async (medicationUuid: string) => {
    try {
      await dispatch(deleteMedicationAction(medicationUuid)).unwrap();

      toast.success("Medication deleted successfully");
    } catch (err) {
      const error = err as SerializedError;
      toast.error(error.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Medications</div>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-4">
          <Row>
            <Col>
              <h6>
                {currentMedication !== null
                  ? "Update Medication"
                  : "New Medication"}
              </h6>
            </Col>
          </Row>
          <NewUpdateMedication
            currentMedication={currentMedication}
            isUpdate={currentMedication !== null}
            submitComplete={
              currentMedication !== null ? submitComplete : undefined
            }
          />
        </Col>
        <Col md="6">
          <MedicationsList
            onDeleteMedication={onDeleteMedication}
            onUpdateMedication={onUpdateMedication}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default MedicationsPage;
