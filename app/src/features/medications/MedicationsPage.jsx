import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { isNil } from "lodash";
import NewMedication from "./NewMedication";
import MedicationsList from "./MedicationsList";
import {
  getMedicationsForPatientAction,
  deleteMedicationAction
} from "./medicationsSlice";

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

  const onDeleteMedication = async (medicationUuid) => {
    try {
      await dispatch(deleteMedicationAction(medicationUuid)).unwrap();

      toast.success("Medication deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

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
          <MedicationsList
            medicationsList={medicationsList}
            onDeleteMedication={onDeleteMedication}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default MedicationsPage;
