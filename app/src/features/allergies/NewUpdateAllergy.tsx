import { SerializedError } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { isNil } from "lodash";
import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { DATE_FORMAT } from "../../constants/general";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { NewAllergy } from "./allergies";
import { createNewAllergyForPatientAction } from "./allergiesSlice";

dayjs.extend(customParseFormat);

const NewUpdateAllergy = () => {
  const dispatch = useAppDispatch();

  const [backendErrorMsg, setBackendErrorMsg] = useState<
    string | null | undefined
  >(null);
  const [allergyName, setAllergyName] = useState("");
  const [isAllergyNameError, setIsAllergyNameError] = useState(false);
  const [isCurrentAllergy, setIsCurrentAllergy] = useState(false);
  const [allergyStartedDateString, setAllergyStartedDateString] = useState("");
  const [isAllergyStartedDateStringError, setIsAllergyStartedDateStringError] =
    useState(false);
  const [allergyEndedDateString, setAllergyEndedDateString] = useState("");
  const [isAllergyEndedDateStringError, setIsAllergyEndedDateStringError] =
    useState(false);
  const [allergyDescription, setAllergyDescription] = useState("");

  const currentPatient = useAppSelector(
    (state) => state.patientsData.currentPatient
  );

  const reinitializeValidationErrors = () => {
    setBackendErrorMsg(null);
    setIsAllergyNameError(false);
    setIsAllergyStartedDateStringError(false);
    setIsAllergyEndedDateStringError(false);
  };

  const reinitializeInputs = () => {
    setAllergyName("");
    setIsCurrentAllergy(false);
    setAllergyStartedDateString("");
    setAllergyEndedDateString("");
    setAllergyDescription("");
  };

  const handleSubmit = () => {
    const handler = async () => {
      let isError = false;

      reinitializeValidationErrors();

      if (isNil(allergyName) || allergyName.length < 1) {
        isError = true;
        setIsAllergyNameError(true);
      }

      if (
        !isNil(allergyStartedDateString) &&
        allergyStartedDateString.length > 0 &&
        !dayjs(allergyStartedDateString, DATE_FORMAT, true).isValid()
      ) {
        isError = true;
        setIsAllergyStartedDateStringError(true);
      }

      if (
        !isNil(allergyEndedDateString) &&
        allergyEndedDateString.length > 0 &&
        !dayjs(allergyEndedDateString, DATE_FORMAT, true).isValid()
      ) {
        isError = true;
        setIsAllergyEndedDateStringError(true);
      }

      if (!isError && currentPatient) {
        try {
          const data: NewAllergy = {
            patientUuid: currentPatient.patientUuid,
            allergyName,
            allergyStartedDate: allergyStartedDateString,
            allergyEndedDate: allergyEndedDateString,
            isCurrentAllergy: isCurrentAllergy,
            description: allergyDescription
          };

          await dispatch(createNewAllergyForPatientAction(data)).unwrap();

          reinitializeValidationErrors();
          reinitializeInputs();

          toast.success("Medication saved successfully");
        } catch (err) {
          const error = err as SerializedError;
          toast.error(error.message);
          setBackendErrorMsg(error.message);
        }
      }
    };

    void handler();
  };

  const abortSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  return (
    <Container>
      <Row>
        <Col>
          <h6>New Allergy</h6>
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
        <Col md="8">
          <Form noValidate onSubmit={abortSubmit}>
            <Form.Group controlId="alrgy-name-input">
              <Form.Label>
                Allergy Name <span className="fw-bold">(required)</span>
              </Form.Label>
              <Form.Control
                name="alrgy-name-input"
                type="text"
                maxLength={500}
                isInvalid={isAllergyNameError}
                value={allergyName}
                onChange={(evt) => setAllergyName(evt.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Allergy Name is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="alrgy-is-current-input"
              className="mt-3 mb-3"
            >
              <Form.Check
                name="alrgy-is-current-input"
                label="Current Allergy"
                type="checkbox"
                checked={isCurrentAllergy}
                onChange={(evt) => setIsCurrentAllergy(evt.target.checked)}
              />
            </Form.Group>
            <Form.Group controlId="alrgy-started-date-input">
              <Form.Label>
                Allergy Started Date{" "}
                <span className="fst-italic">(mm/dd/yyyy)</span>
              </Form.Label>
              <Form.Control
                name="alrgy-started-date-input"
                type="text"
                isInvalid={isAllergyStartedDateStringError}
                value={allergyStartedDateString}
                onChange={(evt) =>
                  setAllergyStartedDateString(evt.target.value)
                }
              />
              <Form.Control.Feedback type="invalid">
                Allergy Started Date must be in the format of MM/DD/YYYY
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="alrgy-ended-date-input">
              <Form.Label>
                Allergy Ended Date{" "}
                <span className="fst-italic">(mm/dd/yyyy)</span>
              </Form.Label>
              <Form.Control
                name="alrgy-ended-date-input"
                type="text"
                isInvalid={isAllergyEndedDateStringError}
                value={allergyEndedDateString}
                onChange={(evt) => setAllergyEndedDateString(evt.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Allergy Ended Date must be in the format of MM/DD/YYYY
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="alrgy-description-input">
              <Form.Label>Allergy Description</Form.Label>
              <Form.Control
                name="alrgy-description-input"
                as="textarea"
                rows={3}
                maxLength={5000}
                value={allergyDescription}
                onChange={(evt) => setAllergyDescription(evt.target.value)}
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

export default NewUpdateAllergy;
