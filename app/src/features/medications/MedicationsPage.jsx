import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { isNil } from "lodash";
import NewMedication from "./NewMedication";
import MedicationsList from "./MedicationsList";
import { getMedicationsForPatientAction } from "./medicationsSlice";

const MedicationsPage = () => {
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
          <div className="glbl-heading">Medications</div>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-4">
          <NewMedication currentPatient={currentPatient} />
        </Col>
        <Col md="6">
          <MedicationsList medicationsList={medicationsList} />
        </Col>
      </Row>
    </Container>
  );
};

export default MedicationsPage;
