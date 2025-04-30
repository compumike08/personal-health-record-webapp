import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import { toast } from "react-toastify";
import { createPatient } from "./patientsSlice";

const NewPatient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState("");
  const [isPatientNameError, setIsPatientNameError] = useState(false);
  const [backendErrorMsg, setBackendErrorMsg] = useState(null);

  const handlePatientNameChange = (evt) => {
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
        navigate("/patientsList");
      } catch (err) {
        toast.error(err.message);
        setBackendErrorMsg(err.message);
      }
    }
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
            <Alert color="danger">{backendErrorMsg}</Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col md="5">
          <Form>
            <FormGroup>
              <Label for="patient-name-input">Patient Name</Label>
              <Input
                id="patient-name-input"
                name="patient-name-input"
                type="text"
                invalid={isPatientNameError}
                value={patientName}
                onChange={handlePatientNameChange}
              />
              <FormFeedback>Patient Name is required</FormFeedback>
            </FormGroup>
            <Button color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NewPatient;
