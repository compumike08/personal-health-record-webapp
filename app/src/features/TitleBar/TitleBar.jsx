import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";

const TitleBar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const toggle = () => setIsNavbarOpen(!isNavbarOpen);

  const isUserLoggedIn = useSelector((state) => state.authData.isUserLoggedIn);

  return (
    <Navbar className="mb-3" bg="primary" data-bs-theme="dark" expand="md">
      <Container fluid>
        <Navbar.Brand>Personal Health Record</Navbar.Brand>
        <Navbar.Toggle onClick={toggle} aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Item>
              <Nav.Link
                activeclassname="active-link"
                className="nav-link"
                to="/"
              >
                Register/Login Page
              </Nav.Link>
            </Nav.Item>
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
                    to="/patientsList"
                  >
                    Patients List
                  </NavLink>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TitleBar;
