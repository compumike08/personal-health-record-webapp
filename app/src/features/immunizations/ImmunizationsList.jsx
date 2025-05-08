import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Accordion, Button, Modal } from "react-bootstrap";
import { isNil } from "lodash";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT } from "../../constants/general";
import { getImmunizationsForPatientAction } from "./immunizationsSlice";

dayjs.extend(customParseFormat);

const ImmunizationsList = ({ onDeleteImmunization, onUpdateImmunization }) => {
  const dispatch = useDispatch();

  const [deleteImzUuid, setDeleteImzUuid] = useState(null);
  const [deleteImzName, setDeleteImzName] = useState(null);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

  const currentPatient = useSelector(
    (state) => state.patientsData.currentPatient
  );

  const selectImmunizationsList = (state) =>
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

  const immunizationsList = useSelector((state) =>
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

  const onConfirmDeleteImmunization = (immunizationUuid, immunizationName) => {
    setDeleteImzUuid(immunizationUuid);
    setDeleteImzName(immunizationName);
    setIsShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDeleteImmunization(deleteImzUuid);
    hideConfirmDelete();
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

ImmunizationsList.propTypes = {
  onDeleteImmunization: PropTypes.func.isRequired,
  onUpdateImmunization: PropTypes.func.isRequired
};

export default ImmunizationsList;
