import PropTypes from "prop-types";
import { Container, Row, Col, Accordion } from "react-bootstrap";

const MedicationsList = ({ medicationsList }) => {
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
                      <div>
                        <span className="fw-bold">Medication Start Date:</span>{" "}
                        {med.medicationStartDate}
                      </div>
                      <div>
                        <span className="fw-bold">Medication End Date:</span>{" "}
                        {med.medicationEndDate}
                      </div>
                      <div>
                        <span className="fw-bold">
                          Is Currently Taking This Medication:
                        </span>{" "}
                        {med.isCurrentlyTaking ? "Yes" : "No"}
                      </div>
                      <div>
                        <span className="fw-bold">Dosage:</span> {med.dosage}{" "}
                        {med.dosageUnit}
                      </div>
                      <p>
                        <span className="fw-bold">Notes:</span> {med.notes}
                      </p>
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
  ).isRequired
};

export default MedicationsList;
