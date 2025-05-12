import { createSelector, SerializedError } from "@reduxjs/toolkit";
import { isNil } from "lodash";
import { useEffect } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { getAllergiesForPatientAction } from "./allergiesSlice";

const AllergiesList = () => {
  const dispatch = useAppDispatch();

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

  return (
    <>
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
