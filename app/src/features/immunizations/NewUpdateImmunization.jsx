import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { isNil } from "lodash";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT } from "../../constants/general";
import { createNewImmunizationForPatientAction } from "./immunizationsSlice";

dayjs.extend(customParseFormat);

const NewUpdateImmunization = () => {
  const dispatch = useDispatch();

  const [backendErrorMsg, setBackendErrorMsg] = useState(null);
  const [immunizationName, setImmunizationName] = useState("");
  const [isImmunizationNameError, setIsImmunizationNameError] = useState(false);
  const [immunizationDateString, setImmunizationDateString] = useState("");
  const [isImmunizationDateStringError, setIsImmunizationDateStringError] =
    useState(false);
  const [providerName, setProviderName] = useState("");
  const [providerLocation, setProviderLocation] = useState("");
  const [description, setDescription] = useState("");

  const currentPatient = useSelector(
    (state) => state.patientsData.currentPatient
  );

  const reinitializeValidationErrors = () => {
    setBackendErrorMsg(null);
    setIsImmunizationNameError(false);
    setIsImmunizationDateStringError(false);
  };

  const reinitializeInputs = () => {
    setImmunizationName("");
    setImmunizationDateString("");
    setProviderName("");
    setProviderLocation("");
    setDescription("");
  };

  const handleSubmit = async () => {
    let isError = false;

    reinitializeValidationErrors();

    if (isNil(immunizationName) || immunizationName.length < 1) {
      isError = true;
      setIsImmunizationNameError(true);
    }

    if (
      isNil(immunizationDateString) ||
      immunizationDateString.length < 1 ||
      !dayjs(immunizationDateString, DATE_FORMAT, true).isValid()
    ) {
      isError = true;
      setIsImmunizationDateStringError(true);
    }

    if (!isError) {
      const data = {
        patientUuid: currentPatient.patientUuid,
        immunizationName: immunizationName,
        immunizationDate: immunizationDateString,
        providerName: providerName,
        providerLocation: providerLocation,
        description: description
      };

      try {
        await dispatch(createNewImmunizationForPatientAction(data)).unwrap();

        reinitializeValidationErrors();
        reinitializeInputs();

        toast.success("Immunization saved successfully");
      } catch (err) {
        toast.error(err.message);
        setBackendErrorMsg(err.message);
      }
    }
  };

  const abortSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  return (
    <Container>
      {backendErrorMsg && (
        <Row>
          <Col>
            <Alert variant="danger">{backendErrorMsg}</Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col md="8">
          <Form noValidate onSubmit={abortSubmit}>
            <Form.Group controlId="imz-name-input">
              <Form.Label>
                Immunization Name <span className="fw-bold">(required)</span>
              </Form.Label>
              <Form.Control
                name="imz-name-input"
                type="text"
                isInvalid={isImmunizationNameError}
                value={immunizationName}
                onChange={(evt) => setImmunizationName(evt.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Immunization Name is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="imz-date-input">
              <Form.Label>
                Immunization Date{" "}
                <span className="fst-italic">(mm/dd/yyyy)</span>
              </Form.Label>
              <Form.Control
                name="imz-date-input"
                type="text"
                isInvalid={isImmunizationDateStringError}
                value={immunizationDateString}
                onChange={(evt) => setImmunizationDateString(evt.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Immunization Date must be in the format of MM/DD/YYYY
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="imz-provider-name-input">
              <Form.Label>Provider Name</Form.Label>
              <Form.Control
                name="imz-provider-name-input"
                type="text"
                value={providerName}
                onChange={(evt) => setProviderName(evt.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="imz-provider-location-input">
              <Form.Label>Provider Location</Form.Label>
              <Form.Control
                name="imz-provider-location-input"
                type="text"
                value={providerLocation}
                onChange={(evt) => setProviderLocation(evt.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="imz-description-input">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="imz-description-input"
                as="textarea"
                rows={3}
                value={description}
                onChange={(evt) => setDescription(evt.target.value)}
              />
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

export default NewUpdateImmunization;
