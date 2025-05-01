import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { getPatientByPatientUuidAction } from "./patientsSlice";

const CurrentPatientLanding = () => {
  const dispatch = useDispatch();
  const { patientUuid } = useParams();

  const currentPatientData = useSelector(
    (state) => state.patientsData.currentPatient
  );

  useEffect(() => {
    dispatch(getPatientByPatientUuidAction(patientUuid));
  }, [patientUuid]);

  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">
            <span className="fw-bold">Patient:</span>{" "}
            {currentPatientData.patientName}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CurrentPatientLanding;
