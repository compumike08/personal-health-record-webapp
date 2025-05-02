import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import {
  getUserProfileAction,
  editUserProfileAction
} from "./userProfileSlice";

const UserProfile = () => {
  const dispatch = useDispatch();

  const reduxUsername = useSelector((state) => state.userProfileData.username);
  const reduxEmail = useSelector((state) => state.userProfileData.email);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [backendErrorMsg, setBackendErrorMsg] = useState(null);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        await dispatch(getUserProfileAction()).unwrap();
      } catch (err) {
        setBackendErrorMsg(err.message);
      }
    }

    getCurrentUser();
  }, [dispatch, setBackendErrorMsg]);

  useEffect(() => {
    setUsername(reduxUsername);
    setEmail(reduxEmail);
  }, [reduxUsername, reduxEmail]);

  const handleUsernameChange = (evt) => {
    setUsername(evt.target.value);
  };

  const handleEmailChange = (evt) => {
    setEmail(evt.target.value);
  };

  const handleSubmit = async () => {
    let isError = false;

    setIsUsernameError(false);
    setIsEmailError(false);
    setBackendErrorMsg(null);

    if (username === null || username.length < 1) {
      isError = true;
      setIsUsernameError(true);
    }

    if (email === null || email.length < 1) {
      isError = true;
      setIsEmailError(true);
    }

    if (isError === false) {
      try {
        await dispatch(
          editUserProfileAction({
            username: username,
            email: email
          })
        ).unwrap();

        toast.success("User profile successfully updated");
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
          <div className="glbl-heading">User Profile</div>
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

export default UserProfile;
