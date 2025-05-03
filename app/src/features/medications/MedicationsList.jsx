import PropTypes from "prop-types";
import { Container, Row, Col, Accordion, Button } from "react-bootstrap";

const MedicationsList = ({ medicationsList, onDeleteMedication }) => {
  return (
    <Container>
      <Row>
        <Col>
          <h6>Medications List</h6>
        </Col>
      </Row>
      {medicationsList.length > 0 && (
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
                            <Button variant="primary">Edit</Button>
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
      )}
    </Container>
  );
};

MedicationsList.propTypes = {
  medicationsList: PropTypes.arrayOf(
    PropTypes.objectOf({
      medicationUuid: PropTypes.string.isRequired,
      medicationName: PropTypes.string.isRequired,
      isCurrentlyTaking: PropTypes.bool.isRequired,
      medicationStartDate: PropTypes.string,
      medicationEndDate: PropTypes.string,
      dosage: PropTypes.number,
      dosageUnit: PropTypes.string,
      notes: PropTypes.string
    })
  ).isRequired,
  onDeleteMedication: PropTypes.func.isRequired
};

export default MedicationsList;
