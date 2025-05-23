import { useState } from "react";
import { SerializedError } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useAppDispatch } from "../../hooks";
import { loginAction } from "./authSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [backendErrorMsg, setBackendErrorMsg] = useState<
    string | null | undefined
  >(null);

  const handleUsernameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(evt.target.value);
  };

  const handlePasswordChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(evt.target.value);
  };

  const handleSubmit = () => {
    const handler = async () => {
      let isError = false;

      setIsUsernameError(false);
      setIsPasswordError(false);
      setBackendErrorMsg(null);

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

          void navigate("/home");
        } catch (err) {
          const error = err as SerializedError;
          setBackendErrorMsg(error.message);
        }
      }
    };

    void handler();
  };

  const abortSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
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
          <Form noValidate onSubmit={abortSubmit}>
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
