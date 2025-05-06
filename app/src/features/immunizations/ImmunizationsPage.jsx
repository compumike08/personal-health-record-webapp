import { Container, Row, Col } from "react-bootstrap";
import ImmunizationsList from "./ImmunizationsList";
import NewUpdateImmunization from "./NewUpdateImmunization";

const ImmunizationsPage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Immunizations</div>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-4">
          <Row>
            <Col>
              <h6>New Immunization</h6>
            </Col>
          </Row>
          <NewUpdateImmunization />
        </Col>
        <Col md="6">
          <ImmunizationsList />
        </Col>
      </Row>
    </Container>
  );
};

export default ImmunizationsPage;
