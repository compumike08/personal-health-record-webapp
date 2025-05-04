import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { isNil, toNumber } from "lodash";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT } from "../../constants/general";
import {
  createNewMedicationForPatientAction,
  updateMedicationAction
} from "./medicationsSlice";

dayjs.extend(customParseFormat);

const NewUpdateMedication = ({
  submitComplete = () => {
    /* noop */
  },
  isUpdate = false,
  currentMedication = null
}) => {
  const dispatch = useDispatch();

  const [backendErrorMsg, setBackendErrorMsg] = useState(null);
  const [medName, setMedName] = useState("");
  const [isMedNameError, setIsMedNameError] = useState(false);
  const [isCurrentlyTakingMed, setIsCurrentlyTakingMed] = useState(false);
  const [medStartDateString, setMedStartDateString] = useState("");
  const [isMedStartDateStringError, setIsMedStartDateStringError] =
    useState(false);
  const [medEndDateString, setMedEndDateString] = useState("");
  const [isMedEndDateStringError, setIsMedEndDateStringError] = useState(false);
  const [medDosage, setMedDosage] = useState("");
  const [medDosageUnit, setMedDosageUnit] = useState("");
  const [medNotes, setMedNotes] = useState("");

  const currentPatient = useSelector(
    (state) => state.patientsData.currentPatient
  );

  useEffect(() => {
    if (isUpdate && !isNil(currentMedication)) {
      setMedName(currentMedication.medicationName);
      setIsCurrentlyTakingMed(currentMedication.isCurrentlyTaking);
      setMedStartDateString(currentMedication.medicationStartDate);
      setMedEndDateString(currentMedication.medicationEndDate);
      setMedDosage(
        isNil(currentMedication.dosage)
          ? ""
          : currentMedication.dosage.toString()
      );
      setMedDosageUnit(currentMedication.dosageUnit);
      setMedNotes(currentMedication.notes);
      reinitializeValidationErrors();
    } else if (isUpdate && isNil(currentMedication)) {
      reinitializeInputs();
      reinitializeValidationErrors();

      if (isUpdate) {
        submitComplete();
      }
    }
  }, [isUpdate, currentMedication, submitComplete]);

  const handleCancel = () => {
    reinitializeInputs();
    reinitializeValidationErrors();

    if (isUpdate) {
      submitComplete();
    }
  };

  const handleMedNameChange = (evt) => {
    setMedName(evt.target.value);
  };

  const handleCurrentlyTakingMedChange = (evt) => {
    setIsCurrentlyTakingMed(evt.target.checked);
  };

  const handleMedStartDateStringChange = (evt) => {
    setMedStartDateString(evt.target.value);
  };

  const handleMedEndDateStringChange = (evt) => {
    setMedEndDateString(evt.target.value);
  };

  const handleMedDosageChange = (evt) => {
    setMedDosage(evt.target.value);
  };

  const handleMedDosageUnitChange = (evt) => {
    setMedDosageUnit(evt.target.value);
  };

  const handleMedNotesChange = (evt) => {
    setMedNotes(evt.target.value);
  };

  const reinitializeValidationErrors = () => {
    setBackendErrorMsg(null);
    setIsMedNameError(false);
    setIsMedStartDateStringError(false);
    setIsMedEndDateStringError(false);
  };

  const reinitializeInputs = () => {
    setMedName("");
    setIsCurrentlyTakingMed(false);
    setMedStartDateString("");
    setMedEndDateString("");
    setMedDosage("");
    setMedDosageUnit("");
    setMedNotes("");
  };

  const handleSubmit = async () => {
    let isError = false;

    reinitializeValidationErrors();

    if (isNil(medName) || medName.length < 1) {
      isError = true;
      setIsMedNameError(true);
    }

    if (
      !isNil(medStartDateString) &&
      medStartDateString.length > 0 &&
      !dayjs(medStartDateString, DATE_FORMAT, true).isValid()
    ) {
      isError = true;
      setIsMedStartDateStringError(true);
    }

    if (
      !isNil(medEndDateString) &&
      medEndDateString.length > 0 &&
      !dayjs(medEndDateString, DATE_FORMAT, true).isValid()
    ) {
      isError = true;
      setIsMedEndDateStringError(true);
    }

    if (!isError) {
      const data = isUpdate
        ? {
            medicationUuid: currentMedication.medicationUuid,
            medicationName: medName,
            isCurrentlyTaking: isCurrentlyTakingMed,
            medicationStartDate: medStartDateString,
            medicationEndDate: medEndDateString,
            dosage: medDosage.length > 0 ? toNumber(medDosage) : null,
            dosageUnit: medDosageUnit,
            notes: medNotes
          }
        : {
            patientUuid: currentPatient.patientUuid,
            medicationName: medName,
            isCurrentlyTaking: isCurrentlyTakingMed,
            medicationStartDate: medStartDateString,
            medicationEndDate: medEndDateString,
            dosage: medDosage.length > 0 ? toNumber(medDosage) : null,
            dosageUnit: medDosageUnit,
            notes: medNotes
          };

      try {
        if (isUpdate) {
          await dispatch(updateMedicationAction(data)).unwrap();
        } else {
          await dispatch(createNewMedicationForPatientAction(data)).unwrap();
        }

        reinitializeValidationErrors();
        reinitializeInputs();

        toast.success("Medication saved successfully");
        submitComplete();
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
            <Form.Group
              controlId="med-is-currently-taking-input"
              className="mt-3 mb-3"
            >
              <Form.Check
                name="med-is-currently-taking-input"
                label="Currently Taking This Medication"
                type="checkbox"
                checked={isCurrentlyTakingMed}
                onChange={handleCurrentlyTakingMedChange}
              />
            </Form.Group>
            <Form.Group controlId="med-start-date-input">
              <Form.Label>
                Medication Started Date{" "}
                <span className="fst-italic">(mm/dd/yyyy)</span>
              </Form.Label>
              <Form.Control
                name="med-start-date-input"
                type="text"
                isInvalid={isMedStartDateStringError}
                value={medStartDateString}
                onChange={handleMedStartDateStringChange}
              />
              <Form.Control.Feedback type="invalid">
                Medication Started Date must be in the format of MM/DD/YYYY
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="med-end-date-input">
              <Form.Label>
                Medication Ended Date{" "}
                <span className="fst-italic">(mm/dd/yyyy)</span>
              </Form.Label>
              <Form.Control
                name="med-end-date-input"
                type="text"
                isInvalid={isMedEndDateStringError}
                value={medEndDateString}
                onChange={handleMedEndDateStringChange}
              />
              <Form.Control.Feedback type="invalid">
                Medication Ended Date must be in the format of MM/DD/YYYY
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="med-dosage-input">
              <Form.Label>Medication Dosage</Form.Label>
              <Form.Control
                name="med-dosage-input"
                type="number"
                value={medDosage}
                onChange={handleMedDosageChange}
              />
            </Form.Group>
            <Form.Group controlId="med-dosage-unit-input">
              <Form.Label>Medication Dosage Unit</Form.Label>
              <Form.Control
                name="med-dosage-unit-input"
                type="text"
                value={medDosageUnit}
                onChange={handleMedDosageUnitChange}
              />
            </Form.Group>
            <Form.Group controlId="med-notes-input">
              <Form.Label>Medication Notes</Form.Label>
              <Form.Control
                name="med-notes-input"
                as="textarea"
                rows={3}
                value={medNotes}
                onChange={handleMedNotesChange}
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

NewUpdateMedication.propTypes = {
  currentMedication:
    PropTypes.objectOf({
      medicationUuid: PropTypes.string.isRequired,
      medicationName: PropTypes.string.isRequired,
      isCurrentlyTaking: PropTypes.bool.isRequired,
      medicationStartDate: PropTypes.string,
      medicationEndDate: PropTypes.string,
      dosage: PropTypes.number,
      dosageUnit: PropTypes.string,
      notes: PropTypes.string
    }) || null,
  submitComplete: PropTypes.func,
  isUpdate: PropTypes.bool,
  mediciationUuid: PropTypes.string
};

export default NewUpdateMedication;
