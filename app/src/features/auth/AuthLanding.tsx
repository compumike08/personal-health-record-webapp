import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AuthLanding = () => {
  const navigate = useNavigate();

  const handleRegisterUser = () => {
    void navigate("/registerUser");
  };

  const handleLogin = () => {
    void navigate("/login");
  };

  return (
    <Container className="main-menu-container">
      <Row>
        <Col>
          <div className="glbl-heading">What would you like to do?</div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            variant="primary"
            className="btn-menu-cmd"
            size="lg"
            onClick={handleRegisterUser}
          >
            Register as New User
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            variant="primary"
            className="btn-menu-cmd"
            size="lg"
            onClick={handleLogin}
          >
            Login as Existing User
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthLanding;
