import PropTypes from "prop-types";
import { Card, Container, Row, Col } from "react-bootstrap";

const PatientCard = ({ patientName }) => {
  return (
    <Card color="light">
      <Card.Body>
        <Container>
          <Row>
            <Col xs="9">
              <Card.Title tag="h4">{patientName}</Card.Title>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

PatientCard.propTypes = {
  patientName: PropTypes.string.isRequired
};

export default PatientCard;
