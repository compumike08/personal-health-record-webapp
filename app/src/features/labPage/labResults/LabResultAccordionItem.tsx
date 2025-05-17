import { Accordion, Col, Container, Row } from "react-bootstrap";
import { LabResult } from "./labResults";

interface LabResultProps {
  labResult: LabResult;
  keyPrefix: string;
}

const LabResultAccordionItem: React.FC<LabResultProps> = ({
  labResult,
  keyPrefix
}) => {
  return (
    <Accordion.Item
      eventKey={`${keyPrefix}-event-key-${labResult.labResultUuid}`}
    >
      <Accordion.Header>
        {labResult.labResultName} - {labResult.labResultDate}
      </Accordion.Header>
      <Accordion.Body>
        <Container>
          <Row>
            <Col>
              <span className="fw-bold">Date:</span> {labResult.labResultDate}
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="fw-bold">Provider Name:</span>{" "}
              {labResult.labResultProviderName}
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="fw-bold">Provider Location:</span>{" "}
              {labResult.labResultProviderLocation}
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="fw-bold">Lab Result Value:</span>{" "}
              {labResult.labResultValue}
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="fw-bold">Lab Reference Range:</span>{" "}
              {labResult.labResultReferenceRange}
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                <span className="fw-bold">Notes:</span>{" "}
                {labResult.labResultNotes}
              </p>
            </Col>
          </Row>
        </Container>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default LabResultAccordionItem;
