import { useEffect } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { isNil } from "lodash";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT } from "../../constants/general";
import { getImmunizationsForPatientAction } from "./immunizationsSlice";

dayjs.extend(customParseFormat);

const ImmunizationsList = () => {
  const dispatch = useDispatch();

  const currentPatient = useSelector(
    (state) => state.patientsData.currentPatient
  );

  const selectImmunizationsList = (state) =>
    state.immunizationsData.immunizationsList;

  const selectSortedImmunizationsList = createSelector(
    [selectImmunizationsList],
    (immunizationsList) => {
      const clonedImmunizationsList = immunizationsList.map((imz) => {
        return {
          ...imz,
          immunizationDate: dayjs(imz.immunizationDate, DATE_FORMAT)
        };
      });

      clonedImmunizationsList.sort((a, b) =>
        b.immunizationDate.diff(a.immunizationDate)
      );

      return clonedImmunizationsList.map((imz) => {
        return {
          ...imz,
          immunizationDate: imz.immunizationDate.format(DATE_FORMAT)
        };
      });
    }
  );

  const immunizationsList = useSelector((state) =>
    selectSortedImmunizationsList(state)
  );

  useEffect(() => {
    if (
      !isNil(currentPatient) &&
      !isNil(currentPatient.patientUuid) &&
      currentPatient.patientUuid.length > 0
    ) {
      dispatch(getImmunizationsForPatientAction(currentPatient.patientUuid));
    }
  }, [dispatch, currentPatient]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h6>
              Immunizations List{" "}
              <span className="fst-italic">
                (sorted by immunization date, descending)
              </span>
            </h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion alwaysOpen>
              {immunizationsList.map((imz) => {
                return (
                  <Accordion.Item
                    key={`imz-key-${imz.immunizationUuid}`}
                    eventKey={`imz-event-key-${imz.immunizationUuid}`}
                  >
                    <Accordion.Header>
                      {imz.immunizationName} - {imz.immunizationDate}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Container>
                        <Row>
                          <Col>
                            <span className="fw-bold">Immunization Date:</span>{" "}
                            {imz.immunizationDate}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <span className="fw-bold">Provider Name:</span>{" "}
                            {imz.providerName}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <span className="fw-bold">Provider Location:</span>{" "}
                            {imz.providerLocation}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p>
                              <span className="fw-bold">Description:</span>{" "}
                              {imz.description}
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

export default ImmunizationsList;
