import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Accordion, Button } from "react-bootstrap";
import { isNil } from "lodash";
import { getMedicationsForPatientAction } from "./medicationsSlice";

const MedicationsList = ({ onDeleteMedication, onUpdateMedication }) => {
  const dispatch = useDispatch();

  const currentPatient = useSelector(
    (state) => state.patientsData.currentPatient
  );

  const medicationsList = useSelector(
    (state) => state.medicationsData.medicationsList
  );

  useEffect(() => {
    if (
      !isNil(currentPatient) &&
      !isNil(currentPatient.patientUuid) &&
      currentPatient.patientUuid.length > 0
    ) {
      dispatch(getMedicationsForPatientAction(currentPatient.patientUuid));
    }
  }, [dispatch, currentPatient]);

  return (
    <Container>
      <Row>
        <Col>
          <h6>Medications List</h6>
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
                          <span className="fw-bold">Medication End Date:</span>{" "}
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
                          <span className="fw-bold">Dosage:</span> {med.dosage}{" "}
                          {med.dosageUnit}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p>
                            <span className="fw-bold">Notes:</span> {med.notes}
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
                              onDeleteMedication(med.medicationUuid);
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
  );
};

MedicationsList.propTypes = {
  onDeleteMedication: PropTypes.func.isRequired,
  onUpdateMedication: PropTypes.func.isRequired
};

export default MedicationsList;
