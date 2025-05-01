import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import { loginAction } from "./authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [backendErrorMsg, setBackendErrorMsg] = useState(null);

  const handleUsernameChange = (evt) => {
    setUsername(evt.target.value);
  };

  const handlePasswordChange = (evt) => {
    setPassword(evt.target.value);
  };

  const handleSubmit = async () => {
    let isError = false;

    setIsUsernameError(false);
    setIsPasswordError(false);
    setBackendErrorMsg(false);

    if (username === null || username.length < 1) {
      isError = true;
      setIsUsernameError(true);
    }

    if (password === null || password.length < 1) {
      isError = true;
      setIsPasswordError(true);
    }

    if (isError === false) {
      try {
        await dispatch(
          loginAction({
            username: username,
            password: password
          })
        ).unwrap();

        navigate("/home");
      } catch (err) {
        setBackendErrorMsg(err.message);
      }
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Login</div>
        </Col>
      </Row>
      {backendErrorMsg && (
        <Row>
          <Col>
            <Alert variant="danger">{backendErrorMsg}</Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col md="5">
          <Form>
            <Form.Group controlId="username-input">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username-input"
                type="text"
                isInvalid={isUsernameError}
                value={username}
                onChange={handleUsernameChange}
              />
              <Form.Control.Feedback type="invalid">
                Username is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password-input">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password-input"
                type="password"
                isInvalid={isPasswordError}
                value={password}
                onChange={handlePasswordChange}
              />
              <Form.Control.Feedback type="invalid">
                Password is required
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col>
                <Button
                  className="mt-3"
                  variant="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
