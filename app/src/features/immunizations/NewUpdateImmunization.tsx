import { SerializedError } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { DATE_FORMAT } from "../../constants/general";
import {
  createNewImmunizationForPatientAction,
  updateImmunizationAction
} from "./immunizationsSlice";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { Immunization, NewImmunization } from "./immunizations";

dayjs.extend(customParseFormat);

interface NewUpdateImmunizationProps {
  submitComplete: (() => void) | undefined;
  isUpdate: boolean;
  currentImmunization: Immunization | null;
}

const NewUpdateImmunization: React.FC<NewUpdateImmunizationProps> = ({
  submitComplete = () => {
    /* noop */
  },
  isUpdate = false,
  currentImmunization
}) => {
  const dispatch = useAppDispatch();

  const [backendErrorMsg, setBackendErrorMsg] = useState<
    string | null | undefined
  >(null);
  const [immunizationName, setImmunizationName] = useState("");
  const [isImmunizationNameError, setIsImmunizationNameError] = useState(false);
  const [immunizationDateString, setImmunizationDateString] = useState("");
  const [isImmunizationDateStringError, setIsImmunizationDateStringError] =
    useState(false);
  const [providerName, setProviderName] = useState<string>("");
  const [providerLocation, setProviderLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const currentPatient = useAppSelector(
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

  useEffect(() => {
    if (isUpdate && !isNil(currentImmunization)) {
      setImmunizationName(currentImmunization.immunizationName);
      setImmunizationDateString(currentImmunization.immunizationDate);
      setProviderName(currentImmunization.providerName);
      setProviderLocation(currentImmunization.providerLocation);
      setDescription(currentImmunization.description);
      reinitializeValidationErrors();
    } else if (isUpdate && isNil(currentImmunization)) {
      reinitializeInputs();
      reinitializeValidationErrors();
      submitComplete();
    }
  }, [isUpdate, currentImmunization, submitComplete]);

  const handleCancel = () => {
    reinitializeInputs();
    reinitializeValidationErrors();

    if (isUpdate) {
      submitComplete();
    }
  };

  const handleSubmit = () => {
    const handler = async () => {
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
        try {
          if (isUpdate && currentImmunization) {
            const data: Immunization = {
              immunizationUuid: currentImmunization.immunizationUuid,
              immunizationName: immunizationName,
              immunizationDate: immunizationDateString,
              providerName: providerName,
              providerLocation: providerLocation,
              description: description
            };

            await dispatch(updateImmunizationAction(data)).unwrap();
          } else if (!isUpdate && currentPatient) {
            const data: NewImmunization = {
              patientUuid: currentPatient.patientUuid,
              immunizationName: immunizationName,
              immunizationDate: immunizationDateString,
              providerName: providerName,
              providerLocation: providerLocation,
              description: description
            };

            await dispatch(
              createNewImmunizationForPatientAction(data)
            ).unwrap();
          } else {
            throw new Error(
              "Invalid combination of states when attempting to dispatch create or update immunization action"
            );
          }

          reinitializeValidationErrors();
          reinitializeInputs();

          toast.success("Immunization saved successfully");
          submitComplete();
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
                {isUpdate && (
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="mt-3"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  className={isUpdate ? "mt-3 ms-2" : "mt-3"}
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
