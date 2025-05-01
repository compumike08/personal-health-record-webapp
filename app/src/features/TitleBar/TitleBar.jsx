import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Container, Navbar, Nav, Form } from "react-bootstrap";
import {
  getCurrentUsersPatientsList,
  getPatientByPatientUuidAction
} from "../patients/patientsSlice";

const TitleBar = () => {
  const dispatch = useDispatch();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [selectedPatientUuid, setSelectedPatientUuid] = useState("");
  const toggle = () => setIsNavbarOpen(!isNavbarOpen);

  const isUserLoggedIn = useSelector((state) => state.authData.isUserLoggedIn);
  const patientsList = useSelector((state) => state.patientsData.patientsList);
  const currentPatientName = useSelector(
    (state) => state.patientsData.currentPatient.patientName
  );
  const isCurrentPatientSelected = currentPatientName.length > 0;

  useEffect(() => {
    if (isUserLoggedIn) {
      dispatch(getCurrentUsersPatientsList());
    }

    if (!isUserLoggedIn) {
      setSelectedPatientUuid("");
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (isUserLoggedIn && selectedPatientUuid.length > 0) {
      dispatch(getPatientByPatientUuidAction(selectedPatientUuid));
    }
  }, [selectedPatientUuid, isUserLoggedIn]);

  const handlePatientSelectChange = (evt) => {
    setSelectedPatientUuid(evt.target.value);
  };

  return (
    <Navbar className="mb-3" bg="primary" data-bs-theme="dark" expand="md">
      <Container fluid>
        <Navbar.Brand>Personal Health Record</Navbar.Brand>
        <Navbar.Toggle onClick={toggle} aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {isUserLoggedIn && (
              <>
                <Nav.Item>
                  <NavLink
                    activeclassname="active-link"
                    className="nav-link"
                    to="/logout"
                  >
                    Logout
                  </NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink
                    activeclassname="active-link"
                    className="nav-link"
                    to="/home"
                  >
                    Home
                  </NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink
                    activeclassname="active-link"
                    className="nav-link"
                    to="/userProfile"
                  >
                    User Profile
                  </NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink
                    activeclassname="active-link"
                    className="nav-link"
                    to="/newPatient"
                  >
                    New Patient
                  </NavLink>
                </Nav.Item>
                {isCurrentPatientSelected && (
                  <>
                    <Nav.Item>
                      <NavLink
                        activeclassname="active-link"
                        className="nav-link"
                        to="/immunizations"
                      >
                        Immunizations
                      </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                      <NavLink
                        activeclassname="active-link"
                        className="nav-link"
                        to="/medications"
                      >
                        Medications
                      </NavLink>
                    </Nav.Item>
                  </>
                )}
                {patientsList.length > 0 && (
                  <Form>
                    <Form.Select onChange={handlePatientSelectChange}>
                      <option value="">Select Patient</option>
                      {patientsList.map((patient) => (
                        <option
                          key={patient.patientUuid}
                          value={patient.patientUuid}
                        >
                          {patient.patientName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TitleBar;
