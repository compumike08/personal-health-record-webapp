import { useEffect, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { Container, Row, Col, Accordion, Button, Modal } from "react-bootstrap";
import { isNil } from "lodash";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT } from "../../constants/general";
import { getImmunizationsForPatientAction } from "./immunizationsSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";

dayjs.extend(customParseFormat);

interface OnDeleteImmunizationFunction {
  (immunizationUuid: string): Promise<void>;
}

interface OnUpdateImmunizationFunction {
  (immunizationUuid: string): void;
}

interface ImmunizationsListProps {
  onDeleteImmunization: OnDeleteImmunizationFunction;
  onUpdateImmunization: OnUpdateImmunizationFunction;
}

const ImmunizationsList: React.FC<ImmunizationsListProps> = ({
  onDeleteImmunization,
  onUpdateImmunization
}) => {
  const dispatch = useAppDispatch();

  const [deleteImzUuid, setDeleteImzUuid] = useState<string | null>(null);
  const [deleteImzName, setDeleteImzName] = useState<string | null>(null);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

  const currentPatient = useAppSelector(
    (state) => state.patientsData.currentPatient
  );

  const selectImmunizationsList = (state: RootState) =>
    state.immunizationsData.immunizationsList;

  const selectSortedImmunizationsList = createSelector(
    [selectImmunizationsList],
    (immunizationsList) => {
      const clonedImmunizationsList = immunizationsList.map((imz) => {
        return {
          ...imz,
          immunizationDate: dayjs(imz.immunizationDate, DATE_FORMAT)
        };
      });

      clonedImmunizationsList.sort((a, b) =>
        b.immunizationDate.diff(a.immunizationDate)
      );

      return clonedImmunizationsList.map((imz) => {
        return {
          ...imz,
          immunizationDate: imz.immunizationDate.format(DATE_FORMAT)
        };
      });
    }
  );

  const immunizationsList = useAppSelector((state) =>
    selectSortedImmunizationsList(state)
  );

  useEffect(() => {
    if (
      !isNil(currentPatient) &&
      !isNil(currentPatient.patientUuid) &&
      currentPatient.patientUuid.length > 0
    ) {
      dispatch(getImmunizationsForPatientAction(currentPatient.patientUuid));
    }
  }, [dispatch, currentPatient]);

  const onConfirmDeleteImmunization = (
    immunizationUuid: string,
    immunizationName: string
  ) => {
    setDeleteImzUuid(immunizationUuid);
    setDeleteImzName(immunizationName);
    setIsShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteImzUuid) {
      onDeleteImmunization(deleteImzUuid);
      hideConfirmDelete();
    } else {
      throw new Error(
        "deleteImzUuid was null when handleConfirmDelete was called"
      );
    }
  };

  const hideConfirmDelete = () => {
    setIsShowDeleteModal(false);
    setDeleteImzUuid(null);
    setDeleteImzName(null);
  };

  return (
    <>
      <Modal show={isShowDeleteModal} onHide={hideConfirmDelete}>
        <Modal.Header>Delete Immunization</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {deleteImzName}?
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
              Immunizations List{" "}
              <span className="fst-italic">
                (sorted by immunization date, descending)
              </span>
            </h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion alwaysOpen>
              {immunizationsList.map((imz) => {
                return (
                  <Accordion.Item
                    key={`imz-key-${imz.immunizationUuid}`}
                    eventKey={`imz-event-key-${imz.immunizationUuid}`}
                  >
                    <Accordion.Header>
                      {imz.immunizationName} - {imz.immunizationDate}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Container>
                        <Row>
                          <Col>
                            <span className="fw-bold">Immunization Date:</span>{" "}
                            {imz.immunizationDate}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <span className="fw-bold">Provider Name:</span>{" "}
                            {imz.providerName}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <span className="fw-bold">Provider Location:</span>{" "}
                            {imz.providerLocation}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p>
                              <span className="fw-bold">Description:</span>{" "}
                              {imz.description}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button
                              variant="primary"
                              onClick={() =>
                                onUpdateImmunization(imz.immunizationUuid)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              className="ms-2"
                              onClick={() => {
                                onConfirmDeleteImmunization(
                                  imz.immunizationUuid,
                                  `${imz.immunizationName} - ${imz.immunizationDate}`
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

export default ImmunizationsList;
