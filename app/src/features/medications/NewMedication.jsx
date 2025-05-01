import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { getMedicationsForPatientAction } from "./medicationsSlice";

const NewMedication = () => {
  const dispatch = useDispatch();

  const [backendErrorMsg, setBackendErrorMsg] = useState(null);
  const [medName, setMedName] = useState("");
  const [isMedNameError, setIsMedNameError] = useState(false);

  const currentPatient = useSelector(
    (state) => state.patientsData.currentPatient
  );

  useEffect(() => {
    if (currentPatient !== null) {
      dispatch(getMedicationsForPatientAction(currentPatient.patientUuid));
    }
  }, [currentPatient]);

  const handleMedNameChange = (evt) => {
    setMedName(evt.target.value);
  };

  const abortSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">New Medication</div>
        </Col>
      </Row>
      {backendErrorMsg && (
        <Row>
          <Col>
            <Alert variant="danger">{backendErrorMsg}</Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col md="5">
          <Form noValidate onSubmit={abortSubmit}>
            <Form.Group controlId="med-name-input">
              <Form.Label>
                Medication Name <span className="fw-bold">(required)</span>
              </Form.Label>
              <Form.Control
                name="med-name-input"
                type="text"
                isInvalid={isMedNameError}
                value={medName}
                onChange={handleMedNameChange}
              />
              <Form.Control.Feedback type="invalid">
                Medication Name is required
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col>
                <Button
                  className="mt-3"
                  variant="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NewMedication;
