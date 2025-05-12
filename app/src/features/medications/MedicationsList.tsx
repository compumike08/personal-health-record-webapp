import { useEffect, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { Accordion, Button, Col, Container, Modal, Row } from "react-bootstrap";
import { isNil } from "lodash";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { getMedicationsForPatientAction } from "./medicationsSlice";

interface OnDeleteMedicationFunction {
  (medicationUuid: string): Promise<void>;
}

interface OnUpdateMedicationFunction {
  (medicationUuid: string): void;
}

interface MedicationsListProps {
  onDeleteMedication: OnDeleteMedicationFunction;
  onUpdateMedication: OnUpdateMedicationFunction;
}

const MedicationsList: React.FC<MedicationsListProps> = ({
  onDeleteMedication,
  onUpdateMedication
}) => {
  const dispatch = useAppDispatch();

  const [deleteMedUuid, setDeleteMedUuid] = useState<string | null>(null);
  const [deleteMedName, setDeleteMedName] = useState<string | null>(null);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

  const currentPatient = useAppSelector(
    (state) => state.patientsData.currentPatient
  );

  const selectMedicationsList = (state: RootState) =>
    state.medicationsData.medicationsList;

  const selectSortedMedicationsList = createSelector(
    [selectMedicationsList],
    (medicationsList) => {
      const clonedMedicationsList = medicationsList.map((imz) => {
        return {
          ...imz
        };
      });

      clonedMedicationsList.sort((a, b) => {
        return Number(b.isCurrentlyTaking) - Number(a.isCurrentlyTaking);
      });

      return clonedMedicationsList;
    }
  );

  const medicationsList = useAppSelector((state) =>
    selectSortedMedicationsList(state)
  );

  const onConfirmDeleteMedication = (
    medicationUuid: string,
    medicationName: string
  ) => {
    setDeleteMedUuid(medicationUuid);
    setDeleteMedName(medicationName);
    setIsShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteMedUuid) {
      void onDeleteMedication(deleteMedUuid);
      hideConfirmDelete();
    } else {
      throw new Error(
        "deleteMedUuid was null when handleConfirmDelete was called"
      );
    }
  };

  const hideConfirmDelete = () => {
    setIsShowDeleteModal(false);
    setDeleteMedUuid(null);
    setDeleteMedName(null);
  };

  useEffect(() => {
    if (
      !isNil(currentPatient) &&
      !isNil(currentPatient.patientUuid) &&
      currentPatient.patientUuid.length > 0
    ) {
      void dispatch(getMedicationsForPatientAction(currentPatient.patientUuid));
    }
  }, [dispatch, currentPatient]);

  return (
    <>
      <Modal show={isShowDeleteModal} onHide={hideConfirmDelete}>
        <Modal.Header>Delete Medication</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {deleteMedName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideConfirmDelete}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        <Row>
          <Col>
            <h6>
              Medications List{" "}
              <span className="fst-italic">
                (meds currently being taken sorted first)
              </span>
            </h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion alwaysOpen>
              {medicationsList.map((med) => {
                return (
                  <Accordion.Item
                    key={`med-key-${med.medicationUuid}`}
                    eventKey={`med-event-key-${med.medicationUuid}`}
                  >
                    <Accordion.Header>{med.medicationName}</Accordion.Header>
                    <Accordion.Body>
                      <Container>
                        <Row>
                          <Col>
                            <span className="fw-bold">
                              Medication Start Date:
                            </span>{" "}
                            {med.medicationStartDate}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <span className="fw-bold">
                              Medication End Date:
                            </span>{" "}
                            {med.medicationEndDate}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <span className="fw-bold">
                              Is Currently Taking This Medication:
                            </span>{" "}
                            {med.isCurrentlyTaking ? "Yes" : "No"}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <span className="fw-bold">Dosage:</span>{" "}
                            {med.dosage} {med.dosageUnit}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p>
                              <span className="fw-bold">Notes:</span>{" "}
                              {med.notes}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button
                              variant="primary"
                              onClick={() =>
                                onUpdateMedication(med.medicationUuid)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              className="ms-2"
                              onClick={() => {
                                onConfirmDeleteMedication(
                                  med.medicationUuid,
                                  med.medicationName
                                );
                              }}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </Container>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MedicationsList;
