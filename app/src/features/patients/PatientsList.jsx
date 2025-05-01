import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import PatientCard from "./PatientCard";
import { getCurrentUsersPatientsList } from "./patientsSlice";

const PatientsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const patientsList = useSelector((state) => state.patientsData.patientsList);

  useEffect(() => {
    dispatch(getCurrentUsersPatientsList());
  }, []);

  const createNewPatient = () => {
    navigate("/newPatient");
  };

  const handlePatientClicked = (patientUuid) => {
    navigate(`/patient/${patientUuid}`);
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Select a Patient</div>
        </Col>
      </Row>
      <Row>
        <Col className="mb-3">
          <Button variant="primary" onClick={createNewPatient}>
            New Patient
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {patientsList.map((patient) => {
            return (
              <Row key={`patient-${patient.patientUuid}`}>
                <Col
                  md="3"
                  className="mb-1"
                  onClick={() => handlePatientClicked(patient.patientUuid)}
                >
                  <PatientCard patientName={patient.patientName} />
                </Col>
              </Row>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
};

export default PatientsList;
