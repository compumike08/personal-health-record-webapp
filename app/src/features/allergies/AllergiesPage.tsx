import { Col, Container, Row } from "react-bootstrap";
import AllergiesList from "./AllergiesList";
import NewUpdateAllergy from "./NewUpdateAllergy";

const AllergiesPage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Allergies</div>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-4">
          <NewUpdateAllergy />
        </Col>
        <Col md="6">
          <AllergiesList />
        </Col>
      </Row>
    </Container>
  );
};

export default AllergiesPage;
