import { useState, useEffect } from "react";
import { SerializedError } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import {
  getUserProfileAction,
  editUserProfileAction
} from "./userProfileSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

const UserProfile = () => {
  const dispatch = useAppDispatch();

  const reduxUsername = useAppSelector(
    (state) => state.userProfileData.username
  );
  const reduxEmail = useAppSelector((state) => state.userProfileData.email);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [backendErrorMsg, setBackendErrorMsg] = useState<
    string | null | undefined
  >(null);

  useEffect(() => {
    const handler = async () => {
      try {
        await dispatch(getUserProfileAction()).unwrap();
      } catch (err) {
        const error = err as SerializedError;
        toast.error(error.message);
        setBackendErrorMsg(error.message);
      }
    };

    void handler();
  }, [dispatch, setBackendErrorMsg]);

  useEffect(() => {
    setUsername(reduxUsername);
    setEmail(reduxEmail);
  }, [reduxUsername, reduxEmail]);

  const handleUsernameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(evt.target.value);
  };

  const handleEmailChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(evt.target.value);
  };

  const handleSubmit = () => {
    const handler = async () => {
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
          const error = err as SerializedError;
          toast.error(error.message);
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
