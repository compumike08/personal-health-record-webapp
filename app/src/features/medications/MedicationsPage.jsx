import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import NewUpdateMedication from "./NewUpdateMedication";
import MedicationsList from "./MedicationsList";
import { deleteMedicationAction } from "./medicationsSlice";

const MedicationsPage = () => {
  const dispatch = useDispatch();

  const [selectedCurrentMedUuid, setSelectedCurrentMedUuid] = useState(null);

  const getMedicationsList = (state) => state.medicationsData.medicationsList;
  const selectCurrentMedicationUuid = (_state, currentMedicationUuid) =>
    currentMedicationUuid;

  const selectCurrentMedication = createSelector(
    [getMedicationsList, selectCurrentMedicationUuid],
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

  const currentMedication = useSelector((state) =>
    selectCurrentMedication(state, selectedCurrentMedUuid)
  );

  const onUpdateMedication = (medicationUuid) => {
    setSelectedCurrentMedUuid(medicationUuid);
  };

  const submitComplete = () => {
    setSelectedCurrentMedUuid(null);
  };

  const onDeleteMedication = async (medicationUuid) => {
    try {
      await dispatch(deleteMedicationAction(medicationUuid)).unwrap();

      toast.success("Medication deleted successfully");
    } catch (err) {
      toast.error(err.message);
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
              <h6>New Medication</h6>
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
