import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import { registerUserAction } from "./authSlice";

const RegisterUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isReenteredPasswordError, setIsReenteredPasswordError] =
    useState(false);
  const [isPasswordsNotMatch, setIsPasswordsNotMatch] = useState(false);
  const [backendErrorMsg, setBackendErrorMsg] = useState(null);

  const handleUsernameChange = (evt) => {
    setUsername(evt.target.value);
  };

  const handleEmailChange = (evt) => {
    setEmail(evt.target.value);
  };

  const handlePasswordChange = (evt) => {
    setPassword(evt.target.value);
  };

  const handleReenteredPasswordChange = (evt) => {
    setReenteredPassword(evt.target.value);
  };

  const handleSubmit = async () => {
    let isError = false;

    setIsUsernameError(false);
    setIsEmailError(false);
    setIsPasswordError(false);
    setIsReenteredPasswordError(false);
    setIsPasswordsNotMatch(false);
    setBackendErrorMsg(null);

    if (username === null || username.length < 1) {
      isError = true;
      setIsUsernameError(true);
    }

    if (email === null || email.length < 1) {
      isError = false;
      setIsEmailError(true);
    }

    if (password === null || password.length < 1) {
      isError = true;
      setIsPasswordError(true);
    }

    if (reenteredPassword === null || reenteredPassword.length < 1) {
      isError = true;
      setIsReenteredPasswordError(true);
    }

    if (password !== reenteredPassword) {
      isError = true;
      setIsReenteredPasswordError(true);
      setIsPasswordsNotMatch(true);
    }

    if (isError === false) {
      try {
        await dispatch(
          registerUserAction({
            username: username,
            email: email,
            password: password
          })
        ).unwrap();

        toast.success("New user successfully registered");
        navigate("/login");
      } catch (err) {
        toast.error(err.message);
        setBackendErrorMsg(err.message);
      }
    }
  };

  const abortSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Register New User</div>
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
            <Form.Group controlId="email-input">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email-input"
                type="text"
                isInvalid={isEmailError}
                value={email}
                onChange={handleEmailChange}
              />
              <Form.Control.Feedback type="invalid">
                Email is required
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
            <Form.Group controlId="reentered-password-input">
              <Form.Label>Re-enter Password</Form.Label>
              <Form.Control
                name="reentered-password-input"
                type="password"
                isInvalid={isReenteredPasswordError}
                value={reenteredPassword}
                onChange={handleReenteredPasswordChange}
              />
              <Form.Control.Feedback type="invalid">
                {isPasswordsNotMatch
                  ? "Passwords do not match"
                  : "Re-enter password is required"}
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

export default RegisterUser;
