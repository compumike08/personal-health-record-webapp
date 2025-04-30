import PropTypes from "prop-types";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const PatientCard = ({ patientName }) => {
  return (
    <Card color="light">
      <CardBody>
        <Container>
          <Row>
            <Col xs="9">
              <CardTitle tag="h4">{patientName}</CardTitle>
            </Col>
          </Row>
        </Container>
      </CardBody>
    </Card>
  );
};

PatientCard.propTypes = {
  patientName: PropTypes.string.isRequired
};

export default PatientCard;
