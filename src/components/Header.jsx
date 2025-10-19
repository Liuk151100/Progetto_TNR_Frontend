import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useAuthContext } from "../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Loghi/LOGO-VETTORIALE-NEW-RACING.svg";

const NAV_LINKS = [
  { label: "TEAM", path: "team" },
  { label: "GALLERIA", path: "gallery" },
  { label: "EVENTI", path: "events" },
  { label: "SAFEGUARDING", path: "safe" },
  { label: "CONTATTI", path: "contacts" },
];

const UserMenu = ({ token, logout }) => {
  if (!token) {
    return (
      <Button
        variant="dark"
        size="sm"
        as={Link}
        to="/Login"
        className="ms-3 fw-bold"
        style={{ borderRadius: "20px" }}
      >
        Login
      </Button>
    );
  }


  return (
    <NavDropdown
      align="end"
      title={<PersonCircle size={26} color="black" />}
      id="user-dropdown"
      className="ms-3"
    >
      <NavDropdown.Item to="/me" as={Link}>
        Profile
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item to="/" as={Link} onClick={logout}>
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default function Header() {
  const { token, loggedUser, logout } = useAuthContext();

  return (
    <header>
      <Navbar expand="lg" bg="light" className="px-3 py-2 shadow-sm">
        <Container fluid className="d-flex align-items-center justify-content-between">
          {/* LOGO */}
          <Navbar.Brand href="/">
            <img
              src={logo}
              alt="Logo"
              style={{ height: "50px", width: "auto" }}
            />
          </Navbar.Brand>

          {/* MOBILE: TOGGLE + USER MENU (sempre affianco al logo) */}
          <div className="d-flex align-items-center d-lg-none ms-auto">
            <UserMenu token={token} logout={logout} />
            <Navbar.Toggle aria-controls="navbarResponsive" className="ms-2 border-0" />
          </div>

          {/* COLLAPSIBLE LINKS */}
          <Navbar.Collapse id="navbarResponsive" className="mt-2 mt-lg-0 d-lg-flex flex-grow-1 justify-content-start">
            <Nav className="my-2 my-lg-0" navbarScroll>
              {NAV_LINKS.map((link) => (
                <Nav.Link
                  key={link.path}
                  href={link.path}
                  style={{ fontSize: "1em", fontWeight: "bold", marginRight: "1.5rem" }}
                >
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>

            {/* DESKTOP: USER MENU a destra dei link */}
            <div className="d-none d-lg-flex ms-auto">
              <UserMenu token={token} logout={logout} />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}