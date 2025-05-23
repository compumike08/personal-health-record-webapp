import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  getCurrentUsersPatientsList,
  getPatientByPatientUuidAction
} from "../patients/patientsSlice";

import "./TitleBar.css";

const TitleBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [selectedPatientUuid, setSelectedPatientUuid] = useState("");

  const toggle = () => setIsNavbarOpen(!isNavbarOpen);

  const isUserLoggedIn = useAppSelector(
    (state) => state.authData.isUserLoggedIn
  );
  const patientsList = useAppSelector(
    (state) => state.patientsData.patientsList
  );
  const currentPatient = useAppSelector(
    (state) => state.patientsData.currentPatient
  );
  const isCurrentPatientSelected = currentPatient !== null;

  useEffect(() => {
    if (isUserLoggedIn) {
      void dispatch(getCurrentUsersPatientsList());
    }

    if (!isUserLoggedIn) {
      setSelectedPatientUuid("");
    }
  }, [isUserLoggedIn, dispatch]);

  useEffect(() => {
    if (isUserLoggedIn && selectedPatientUuid.length > 0) {
      void dispatch(getPatientByPatientUuidAction(selectedPatientUuid));
    }
  }, [selectedPatientUuid, isUserLoggedIn, dispatch]);

  const handlePatientSelectChange = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPatientUuid(evt.target.value);
  };

  const abortSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  return (
    <Navbar
      collapseOnSelect
      className="mb-3"
      bg="primary"
      data-bs-theme="dark"
      expand="lg"
    >
      <Container fluid>
        <Navbar.Brand>Personal Health Record</Navbar.Brand>
        <Navbar.Toggle onClick={toggle} aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {isUserLoggedIn && (
              <>
                <Nav.Item>
                  <Nav.Link eventKey="1" className="p-0" as="div">
                    <NavLink className="nav-link" to="/logout">
                      Logout
                    </NavLink>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="2" className="p-0" as="div">
                    <NavLink className="nav-link" to="/home">
                      Home
                    </NavLink>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="3" className="p-0" as="div">
                    <NavLink className="nav-link" to="/userProfile">
                      User Profile
                    </NavLink>
                  </Nav.Link>
                </Nav.Item>
                {isCurrentPatientSelected && (
                  <Nav.Link className="p-0" as="div">
                    <NavDropdown
                      title="Medical Records"
                      id="med-records-nav-dropdown"
                    >
                      <Nav.Link eventKey="4" className="p-0" as="div">
                        <NavDropdown.Item
                          className="nav-link"
                          onClick={() => {
                            void navigate("/allergies");
                          }}
                        >
                          Allergies
                        </NavDropdown.Item>
                      </Nav.Link>
                      <Nav.Link eventKey="5" className="p-0" as="div">
                        <NavDropdown.Item
                          className="nav-link"
                          onClick={() => {
                            void navigate("/immunizations");
                          }}
                        >
                          Immunizations
                        </NavDropdown.Item>
                      </Nav.Link>
                      <Nav.Link eventKey="6" className="p-0" as="div">
                        <NavDropdown.Item
                          className="nav-link"
                          onClick={() => {
                            void navigate("/medications");
                          }}
                        >
                          Medications
                        </NavDropdown.Item>
                      </Nav.Link>
                      <Nav.Link eventKey="7" className="p-0" as="div">
                        <NavDropdown.Item
                          className="nav-link"
                          onClick={() => {
                            void navigate("/labs");
                          }}
                        >
                          Labs
                        </NavDropdown.Item>
                      </Nav.Link>
                    </NavDropdown>
                  </Nav.Link>
                )}
                <Nav.Item>
                  <Nav.Link eventKey="8" className="p-0" as="div">
                    <NavLink className="nav-link" to="/newPatient">
                      New Patient
                    </NavLink>
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
          </Nav>
          {patientsList.length > 0 && (
            <Form onSubmit={abortSubmit} className="form-min-width">
              <Form.Group>
                <Form.Select size="sm" onChange={handlePatientSelectChange}>
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
              </Form.Group>
            </Form>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TitleBar;
