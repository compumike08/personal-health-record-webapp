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
            <Button color="primary" onClick={handleSubmit}>
              Submit
            </Button>{" "}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
