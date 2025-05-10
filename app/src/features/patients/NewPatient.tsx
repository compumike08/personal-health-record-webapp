import { useState } from "react";
import { SerializedError } from "@reduxjs/toolkit";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { createPatient } from "./patientsSlice";
import { useAppDispatch } from "../../hooks";

const NewPatient = () => {
  const dispatch = useAppDispatch();

  const [patientName, setPatientName] = useState("");
  const [isPatientNameError, setIsPatientNameError] = useState(false);
  const [backendErrorMsg, setBackendErrorMsg] = useState<
    string | null | undefined
  >(null);

  const handlePatientNameChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPatientName(evt.target.value);
  };

  const handleSubmit = async () => {
    let isError = false;

    setIsPatientNameError(false);
    setBackendErrorMsg(null);

    if (patientName === null || patientName.length < 1) {
      isError = true;
      setIsPatientNameError(true);
    }

    if (isError === false) {
      try {
        await dispatch(createPatient(patientName)).unwrap();

        toast.success("New patient created successfully");
        setPatientName("");
      } catch (err) {
        const error = err as SerializedError;
        toast.error(error.message);
        setBackendErrorMsg(error.message);
      }
    }
  };

  const abortSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Create New Patient</div>
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
            <Form.Group controlId="patient-name-input">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                name="patient-name-input"
                type="text"
                isInvalid={isPatientNameError}
                value={patientName}
                onChange={handlePatientNameChange}
              />
              <Form.Control.Feedback type="invalid">
                Patient Name is required
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

export default NewPatient;
