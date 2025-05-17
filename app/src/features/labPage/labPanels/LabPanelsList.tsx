import { useEffect, useState } from "react";
import { createSelector, SerializedError } from "@reduxjs/toolkit";
import { isNil } from "lodash";
import {
  Accordion,
  Button,
  Col,
  Container,
  Row,
  Modal,
  Form,
  Alert
} from "react-bootstrap";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT } from "../../../constants/general";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";
import {
  createNewLabPanelForPatientAction,
  getLabPanelsForPatientAction
} from "./labPanelsSlice";
import LabResultAccordionItem from "../labResults/LabResultAccordionItem";
import { NewLabPanel } from "./labPanels";

dayjs.extend(customParseFormat);

interface NewLabResultForm {
  formId: string;
  labResultName: string;
  labResultDate: string;
  labResultProviderName: string;
  labResultProviderLocation: string;
  labResultValue: string;
  labResultReferenceRange: string;
  labResultNotes: string;
}

const LabPanelsList = () => {
  const dispatch = useAppDispatch();

  const [isShowAddLabPanelModal, setIsShowAddLabPanelModal] = useState(false);

  const [labPanelName, setLabPanelName] = useState("");
  const [labPanelDate, setLabPanelDate] = useState("");
  const [backendErrorMsg, setBackendErrorMsg] = useState<
    string | null | undefined
  >(null);
  const [labResultFormList, setLabResultFormList] = useState<
    NewLabResultForm[]
  >([]);

  const selectLabPanelsList = (state: RootState) =>
    state.labPanelsData.labPanelsList;

  const selectSortedLabPanelsList = createSelector(
    [selectLabPanelsList],
    (labPanelsList) => {
      const clonedLabPanelsList = labPanelsList.map((labPanel) => {
        return {
          ...labPanel,
          labResultsList: labPanel.labResultsList.map((labResult) => {
            return {
              ...labResult,
              labResultDate: dayjs(labResult.labResultDate, DATE_FORMAT)
            };
          })
        };
      });

      clonedLabPanelsList.sort((a, b) =>
        b.labResultsList[0].labResultDate.diff(
          a.labResultsList[0].labResultDate
        )
      );

      return clonedLabPanelsList.map((labPanel) => {
        return {
          ...labPanel,
          labResultsList: labPanel.labResultsList.map((labResult) => {
            return {
              ...labResult,
              labResultDate: labResult.labResultDate.format(DATE_FORMAT)
            };
          })
        };
      });
    }
  );

  const currentPatient = useAppSelector(
    (state) => state.patientsData.currentPatient
  );

  const labPanelsList = useAppSelector((state) =>
    selectSortedLabPanelsList(state)
  );

  useEffect(() => {
    if (
      !isNil(currentPatient) &&
      !isNil(currentPatient.patientUuid) &&
      currentPatient.patientUuid.length > 0
    ) {
      const handler = async () => {
        try {
          await dispatch(
            getLabPanelsForPatientAction(currentPatient.patientUuid)
          ).unwrap();
        } catch (err) {
          const error = err as SerializedError;
          toast.error(error.message);
        }
      };

      void handler();
    }
  }, [dispatch, currentPatient]);

  const reinitializeInputs = () => {
    setLabPanelName("");
    setLabPanelDate("");
    setLabResultFormList([]);
  };

  const hideAddLabPanelModal = () => {
    setIsShowAddLabPanelModal(false);
    setBackendErrorMsg(null);
    reinitializeInputs();
  };

  const addLabResultForm = () => {
    setLabResultFormList(
      labResultFormList.concat([
        {
          formId: uuidv4(),
          labResultName: "",
          labResultDate: "",
          labResultProviderName: "",
          labResultProviderLocation: "",
          labResultValue: "",
          labResultReferenceRange: "",
          labResultNotes: ""
        }
      ])
    );
  };

  const assignProperty = <T extends object, K extends keyof T>(
    obj: T,
    key: K,
    val: T[K]
  ) => {
    obj[key] = val;
  };

  const setLabResultForm = (
    formId: string,
    fieldName: keyof NewLabResultForm,
    value: string
  ) => {
    const index = labResultFormList.findIndex((form) => form.formId === formId);
    const newLabResultForm = Object.assign({}, labResultFormList[index]);
    assignProperty(newLabResultForm, fieldName, value);
    const updatedFormList = labResultFormList.filter(
      (form) => form.formId !== formId
    );
    updatedFormList.push(newLabResultForm);
    setLabResultFormList(updatedFormList);
  };

  const abortSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  const handleSubmit = () => {
    const handler = async () => {
      if (!isNil(currentPatient) && !isNil(currentPatient.patientUuid)) {
        const data: NewLabPanel = {
          labPanelName,
          patientUuid: currentPatient.patientUuid,
          labResultsList: labResultFormList.map((labResultForm) => {
            return {
              ...labResultForm,
              labResultDate: labPanelDate,
              patientUuid: currentPatient.patientUuid
            };
          })
        };

        try {
          await dispatch(createNewLabPanelForPatientAction(data)).unwrap();
          hideAddLabPanelModal();
          toast.success("Lab Panel added successfully");
        } catch (err) {
          const error = err as SerializedError;
          toast.error(error.message);
          setBackendErrorMsg(error.message);
        }
      }
    };

    void handler();
  };

  return (
    <>
      <Modal show={isShowAddLabPanelModal} onHide={hideAddLabPanelModal}>
        <Modal.Header>Add Lab Panel</Modal.Header>
        <Modal.Body>
          <Container>
            {backendErrorMsg && (
              <Row>
                <Col>
                  <Alert variant="danger">{backendErrorMsg}</Alert>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <Form noValidate onSubmit={abortSubmit}>
                  <Form.Group controlId="lab-panel-name-input">
                    <Form.Label>
                      Lab Panel Name <span className="fw-bold">(required)</span>
                    </Form.Label>
                    <Form.Control
                      name="lab-panel-name-input"
                      type="text"
                      maxLength={500}
                      value={labPanelName}
                      onChange={(evt) => setLabPanelName(evt.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="lab-panel-date-input">
                    <Form.Label>
                      Lab Result Date{" "}
                      <span className="fst-italic">(mm/dd/yyyy)</span>{" "}
                      <span className="fw-bold">(required)</span>
                    </Form.Label>
                    <Form.Control
                      name="lab-panel-date-input"
                      type="text"
                      value={labPanelDate}
                      onChange={(evt) => setLabPanelDate(evt.target.value)}
                    />
                  </Form.Group>
                  <Row>
                    <Col>
                      <Button className="mt-2 mb-2" onClick={addLabResultForm}>
                        Add Lab Result Form
                      </Button>
                    </Col>
                  </Row>
                  {labResultFormList.map((labResultForm) => {
                    return (
                      <Row key={`lab-result-form-${labResultForm.formId}`}>
                        <Col>
                          <Row>
                            <Col>
                              <span className="fw-bold">New Lab Result</span>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Form.Group
                                controlId={`lab-result-name-input-${labResultForm.formId}`}
                              >
                                <Form.Label>
                                  Lab Result Name{" "}
                                  <span className="fw-bold">(required)</span>
                                </Form.Label>
                                <Form.Control
                                  name={`lab-result-name-input-${labResultForm.formId}`}
                                  type="text"
                                  maxLength={500}
                                  value={labResultForm.labResultName}
                                  onChange={(evt) =>
                                    setLabResultForm(
                                      labResultForm.formId,
                                      "labResultName",
                                      evt.target.value
                                    )
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                controlId={`lab-result-provider-name-input-${labResultForm.formId}`}
                              >
                                <Form.Label>
                                  Lab Result Provider Name
                                </Form.Label>
                                <Form.Control
                                  name={`lab-result-provider-name-input-${labResultForm.formId}`}
                                  type="text"
                                  value={labResultForm.labResultProviderName}
                                  onChange={(evt) =>
                                    setLabResultForm(
                                      labResultForm.formId,
                                      "labResultProviderName",
                                      evt.target.value
                                    )
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                controlId={`lab-result-provider-location-input-${labResultForm.formId}`}
                              >
                                <Form.Label>
                                  Lab Result Provider Location
                                </Form.Label>
                                <Form.Control
                                  name={`lab-result-provider-location-input-${labResultForm.formId}`}
                                  type="text"
                                  value={
                                    labResultForm.labResultProviderLocation
                                  }
                                  onChange={(evt) =>
                                    setLabResultForm(
                                      labResultForm.formId,
                                      "labResultProviderLocation",
                                      evt.target.value
                                    )
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                controlId={`lab-result-value-input-${labResultForm.formId}`}
                              >
                                <Form.Label>Lab Result Value</Form.Label>
                                <Form.Control
                                  name={`lab-result-value-input-${labResultForm.formId}`}
                                  type="text"
                                  value={labResultForm.labResultValue}
                                  onChange={(evt) =>
                                    setLabResultForm(
                                      labResultForm.formId,
                                      "labResultValue",
                                      evt.target.value
                                    )
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                controlId={`lab-result-reference-range-input-${labResultForm.formId}`}
                              >
                                <Form.Label>
                                  Lab Result Reference Range
                                </Form.Label>
                                <Form.Control
                                  name={`lab-result-reference-range-input-${labResultForm.formId}`}
                                  type="text"
                                  value={labResultForm.labResultReferenceRange}
                                  onChange={(evt) =>
                                    setLabResultForm(
                                      labResultForm.formId,
                                      "labResultReferenceRange",
                                      evt.target.value
                                    )
                                  }
                                />
                              </Form.Group>
                              <Form.Group
                                controlId={`lab-result-notes-input-${labResultForm.formId}`}
                              >
                                <Form.Label>Lab Result Notes</Form.Label>
                                <Form.Control
                                  name={`lab-result-notes-input-${labResultForm.formId}`}
                                  as="textarea"
                                  rows={3}
                                  value={labResultForm.labResultNotes}
                                  onChange={(evt) =>
                                    setLabResultForm(
                                      labResultForm.formId,
                                      "labResultNotes",
                                      evt.target.value
                                    )
                                  }
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    );
                  })}
                </Form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideAddLabPanelModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        <Row>
          <Col>
            <h6>
              Lab Panels List{" "}
              <span className="fst-italic">
                (sorted by lab result date, descending)
              </span>
            </h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="mb-2"
              variant="primary"
              size="sm"
              onClick={() => setIsShowAddLabPanelModal(true)}
            >
              Add Lab Panel
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion alwaysOpen>
              {labPanelsList.map((labPanel) => {
                return (
                  <Accordion.Item
                    key={`lpl-key-${labPanel.labPanelUuid}`}
                    eventKey={`lpl-event-key-${labPanel.labPanelUuid}`}
                  >
                    <Accordion.Header>
                      {labPanel.labPanelName} -{" "}
                      {labPanel.labResultsList[0].labResultDate}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Container>
                        <Row>
                          <Col>
                            <span className="fw-bold">Lab Panel Name:</span>{" "}
                            {labPanel.labPanelName}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="fw-bold">Lab Results:</div>
                            <Accordion alwaysOpen>
                              {labPanel.labResultsList.map((labResult) => {
                                return (
                                  <LabResultAccordionItem
                                    key={`lplbr-key-${labResult.labResultUuid}`}
                                    keyPrefix="lplbr"
                                    labResult={labResult}
                                  />
                                );
                              })}
                            </Accordion>
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
      </Container>
    </>
  );
};

export default LabPanelsList;
