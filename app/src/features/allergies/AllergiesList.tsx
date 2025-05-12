import { useEffect, useState } from "react";
import { createSelector, SerializedError } from "@reduxjs/toolkit";
import { Accordion, Button, Col, Container, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { isNil } from "lodash";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import {
  deleteAllergyAction,
  getAllergiesForPatientAction
} from "./allergiesSlice";

interface AllergiesListProps {
  onUpdateAllergy: (allergyUuid: string) => void;
}

const AllergiesList: React.FC<AllergiesListProps> = ({ onUpdateAllergy }) => {
  const dispatch = useAppDispatch();

  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [deleteAllergyUuid, setDeleteAllergyUuid] = useState<string | null>(
    null
  );
  const [deleteAllergyName, setDeleteAllergyName] = useState<string | null>(
    null
  );

  const selectAllergiesList = (state: RootState) =>
    state.allergiesData.allegiesList;

  const selectSortedAllergiesList = createSelector(
    [selectAllergiesList],
    (allergiesList) => {
      const clonedAllergiesList = allergiesList.map((alrgy) => {
        return {
          ...alrgy
        };
      });

      clonedAllergiesList.sort((a, b) => {
        return Number(b.isCurrentAllergy) - Number(a.isCurrentAllergy);
      });

      return clonedAllergiesList;
    }
  );

  const allergiesList = useAppSelector((state) =>
    selectSortedAllergiesList(state)
  );
  const currentPatient = useAppSelector(
    (state) => state.patientsData.currentPatient
  );

  useEffect(() => {
    const handler = async () => {
      if (!isNil(currentPatient)) {
        try {
          await dispatch(
            getAllergiesForPatientAction(currentPatient.patientUuid)
          ).unwrap();
        } catch (err) {
          const error = err as SerializedError;
          toast.error(error.message);
        }
      }
    };

    void handler();
  }, [dispatch, currentPatient]);

  const hideConfirmDelete = () => {
    setIsShowDeleteModal(false);
    setDeleteAllergyUuid(null);
    setDeleteAllergyName(null);
  };

  const onConfirmDeleteAllergy = (allergyUuid: string, allergyName: string) => {
    setDeleteAllergyUuid(allergyUuid);
    setDeleteAllergyName(allergyName);
    setIsShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const handler = async () => {
      if (deleteAllergyUuid) {
        try {
          await dispatch(deleteAllergyAction(deleteAllergyUuid)).unwrap();
          hideConfirmDelete();
        } catch (err) {
          const error = err as SerializedError;
          toast.error(error.message);
        }
      } else {
        throw new Error(
          "deleteAllergyUuid was null when handleConfirmDelete was called"
        );
      }
    };

    void handler();
  };

  return (
    <>
      <Modal show={isShowDeleteModal} onHide={hideConfirmDelete}>
        <Modal.Header>Delete Allergy</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {deleteAllergyName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideConfirmDelete}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        <Row>
          <Col>
            <h6>
              Allergies List{" "}
              <span className="fst-italic">
                (current allergies sorted first)
              </span>
            </h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion alwaysOpen>
              {allergiesList.map((alrgy) => {
                return (
                  <Accordion.Item
                    key={`imz-key-${alrgy.allergyUuid}`}
                    eventKey={`imz-event-key-${alrgy.allergyUuid}`}
                  >
                    <Accordion.Header>{alrgy.allergyName}</Accordion.Header>
                    <Accordion.Body>
                      <Container>
                        <Row>
                          <Col>
                            <span className="fw-bold">
                              Is This A Current Allergy:
                            </span>{" "}
                            {alrgy.isCurrentAllergy ? "Yes" : "No"}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <span className="fw-bold">
                              Allergy Started Date:
                            </span>{" "}
                            {alrgy.allergyStartedDate}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <span className="fw-bold">Allergy Ended Date:</span>{" "}
                            {alrgy.allergyEndedDate}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p>
                              <span className="fw-bold">Description:</span>{" "}
                              {alrgy.description}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button
                              variant="primary"
                              onClick={() => onUpdateAllergy(alrgy.allergyUuid)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              className="ms-2"
                              onClick={() => {
                                onConfirmDeleteAllergy(
                                  alrgy.allergyUuid,
                                  alrgy.allergyName
                                );
                              }}
                            >
                              Delete
                            </Button>
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

export default AllergiesList;
