import React from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useAuthContext } from "../contexts/authContext";
import { Link } from "react-router-dom";

export default function Header() {

  const { token, logout, loggedUser } = useAuthContext();

  return (
    <div style={{height: "10vh"}}>
      <Navbar
        expand="lg"
        bg="light"
        className="px-3"
        style={{ borderBottom: "2px solid white", width: "100%", height: "100%" }}
      >
        <Container fluid className="d-flex align-items-center justify-content-between">
          {/* LOGO */}
          <Navbar.Brand href="/">
            <img
              style={{ height: "50px", width: "auto" }}
              src="./src/assets/Loghi/LOGO-VETTORIALE-NEW-RACING.svg"
              alt="Logo"
            />
          </Navbar.Brand>
  
          {/* --- AREA SEMPRE VISIBILE: REGISTER / LOGIN / ICONA --- */}
  
          <div className="d-flex align-items-center order-lg-2">
            {!token && (
              <>
                {/* <Button
                  variant="outline-dark"
                  size="sm"
                  className="me-2 fw-bold"
                  style={{ borderRadius: "20px" }}
                >
                  Register
                </Button> */}
                <Button
                  variant="dark"
                  size="sm"
                  as={Link}
                  to="/Login"
                  className="me-3 fw-bold"
                  style={{ borderRadius: "20px" }}
                >
                  Login
                </Button>
              </>
            )}
            {/* ICONA UTENTE CON DROPDOWN */}
            {token && (
              <NavDropdown
                align="end"
                title={<PersonCircle size={26} color="black" />}
                id="user-dropdown"
                className="me-2"
              >
                <NavDropdown.Item to="/me" as={Link}>Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item to="/" as={Link} onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
            {/* PULSANTE HAMBURGER (solo mobile) */}
            <Navbar.Toggle
              aria-controls="navbarScroll"
              className="ms-2 border-0"
            />
          </div>
  
          {/* --- LINK DELLA NAVBAR (COLLASSABILI) --- */}
          < Navbar.Collapse id="navbarScroll" className="justify-content-end order-lg-1" >
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link style={{ fontSize: "1em", fontWeight: "bold" }} href="team">
                TEAM
              </Nav.Link>
              <Nav.Link style={{ fontSize: "1em", fontWeight: "bold" }} href="gallery">
                GALLERY
              </Nav.Link>
              <Nav.Link style={{ fontSize: "1em", fontWeight: "bold" }} href="events">
                EVENTS
              </Nav.Link>
              <Nav.Link style={{ fontSize: "1em", fontWeight: "bold" }} href="safe">
                SAFEGUARDING
              </Nav.Link>
              <Nav.Link style={{ fontSize: "1em", fontWeight: "bold" }} href="contacts">
                CONTACTS
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar >
    </div>
  );
}