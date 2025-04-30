import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
import {
  getUserProfileAction,
  editUserProfileAction
} from "./userProfileSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            <Button color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
