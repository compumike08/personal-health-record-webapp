import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
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

        navigate("/login");
      } catch (err) {
        setBackendErrorMsg(err.message);
      }
    }
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
            <Alert color="danger">{backendErrorMsg}</Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col md="5">
          <Form>
            <FormGroup>
              <Label for="username-input">Username</Label>
              <Input
                id="username-input"
                name="username-input"
                type="text"
                invalid={isUsernameError}
                value={username}
                onChange={handleUsernameChange}
              />
              <FormFeedback>Username is required</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="email-input">Email</Label>
              <Input
                id="email-input"
                name="email-input"
                type="text"
                invalid={isEmailError}
                value={email}
                onChange={handleEmailChange}
              />
              <FormFeedback>Email is required</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="password-input">Password</Label>
              <Input
                id="password-input"
                name="password-input"
                type="password"
                invalid={isPasswordError}
                value={password}
                onChange={handlePasswordChange}
              />
              <FormFeedback>Password is required</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="reentered-password-input">Re-enter Password</Label>
              <Input
                id="reentered-password-input"
                name="reentered-password-input"
                type="password"
                invalid={isReenteredPasswordError}
                value={reenteredPassword}
                onChange={handleReenteredPasswordChange}
              />
              <FormFeedback>
                {isPasswordsNotMatch
                  ? "Passwords do not match"
                  : "Re-enter password is required"}
              </FormFeedback>
            </FormGroup>
            <Button color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterUser;
