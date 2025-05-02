import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { isNil } from "lodash";
import { getMedicationsForPatientAction } from "./medicationsSlice";

const MedicationsList = () => {
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

export default MedicationsList;
