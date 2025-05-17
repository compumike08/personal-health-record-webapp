import { useEffect } from "react";
import { createSelector, SerializedError } from "@reduxjs/toolkit";
import { isNil } from "lodash";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT } from "../../../constants/general";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";
import { getLabResultsForPatientAction } from "./labResultsSlice";
import LabResultAccordionItem from "./LabResultAccordionItem";

dayjs.extend(customParseFormat);

const LabResultsList = () => {
  const dispatch = useAppDispatch();

  const selectLabResultsList = (state: RootState) =>
    state.labResultsData.labResultsList;

  const selectSortedLabResultsList = createSelector(
    [selectLabResultsList],
    (labResultsList) => {
      const clonedLabResultsList = labResultsList.map((labResult) => {
        return {
          ...labResult,
          labResultDate: dayjs(labResult.labResultDate, DATE_FORMAT)
        };
      });

      clonedLabResultsList.sort((a, b) =>
        b.labResultDate.diff(a.labResultDate)
      );

      return clonedLabResultsList.map((labResult) => {
        return {
          ...labResult,
          labResultDate: labResult.labResultDate.format(DATE_FORMAT)
        };
      });
    }
  );

  const currentPatient = useAppSelector(
    (state) => state.patientsData.currentPatient
  );

  const labResultsList = useAppSelector((state) =>
    selectSortedLabResultsList(state)
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
            getLabResultsForPatientAction(currentPatient.patientUuid)
          ).unwrap();
        } catch (err) {
          const error = err as SerializedError;
          toast.error(error.message);
        }
      };

      void handler();
    }
  }, [dispatch, currentPatient]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h6>
              Lab Results List{" "}
              <span className="fst-italic">
                (sorted by lab result date, descending)
              </span>
            </h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <Accordion alwaysOpen>
              {labResultsList.map((labResult) => {
                return (
                  <LabResultAccordionItem
                    key={`lbr-key-${labResult.labResultUuid}`}
                    keyPrefix="lbr"
                    labResult={labResult}
                  />
                );
              })}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LabResultsList;
