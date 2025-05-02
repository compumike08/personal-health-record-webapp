import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { isNil } from "lodash";
import { getMedicationsForPatientAction } from "./medicationsSlice";

const MedicationsList = () => {
  const dispatch = useDispatch();

  const currentPatient = useSelector(
    (state) => state.patientsData.currentPatient
  );
  const medicationsList = useSelector(
    (state) => state.medicationsData.medicationsList
  );

  useEffect(() => {
    if (
      !isNil(currentPatient) &&
      !isNil(currentPatient.patientUuid) &&
      currentPatient.patientUuid.length > 0
    ) {
      dispatch(getMedicationsForPatientAction(currentPatient.patientUuid));
    }
  }, [dispatch, currentPatient]);

  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Medications List</div>
        </Col>
      </Row>
      <Row>
        <Col>
          {medicationsList.map((med) => {
            return (
              <Row key={`med-${med.medicationUuid}`}>
                <Col>{med.medicationName}</Col>
              </Row>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
};

export default MedicationsList;
