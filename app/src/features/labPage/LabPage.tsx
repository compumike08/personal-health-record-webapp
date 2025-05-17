import { Col, Container, Row } from "react-bootstrap";
import LabPanelsList from "./labPanels/LabPanelsList";
import LabResultsList from "./labResults/LabResultsList";

const LabPage = () => {
  return (
    <Container>
      <Row>
        <Col md="6">
          <LabPanelsList />
        </Col>
        <Col md="6">
          <LabResultsList />
        </Col>
      </Row>
    </Container>
  );
};

export default LabPage;
