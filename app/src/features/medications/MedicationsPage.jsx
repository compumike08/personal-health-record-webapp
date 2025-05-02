import { Container, Row, Col } from "react-bootstrap";
import NewMedication from "./NewMedication";
import MedicationsList from "./MedicationsList";

const MedicationsPage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Medications</div>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-4">
          <NewMedication />
        </Col>
        <Col md="6">
          <MedicationsList />
        </Col>
      </Row>
    </Container>
  );
};

export default MedicationsPage;
