import React, { Component } from "react";
import AllRoutes from "./components/AllRoutes";
//import NavbarInstance from "./components/NavbarInstance";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import SelectAccounts from "./components/SelectAccounts";

import moment from "moment";

require("moment");
require("moment-timezone");
moment.tz.setDefault("America/Chicago");

require("dotenv").config();

export default class App extends Component {
  render() {
    return (
      <>
        <Navbar bg="light" expand="lg">
          <Container fluid>
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                <Nav.Link href="/payments">Payment</Nav.Link>
                <Nav.Link href="/payment/required">Payment Required</Nav.Link>
                <Nav.Link href="/freeform">FreeForm</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
                <NavDropdown title="Actions" id="navbarScrollingDropdown">
                  <NavDropdown.Item href="#action3">Action-1</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">Action-2</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">Action-3</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="#" disabled>
                  Link
                </Nav.Link>
              </Nav>
              <SelectAccounts />
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <AllRoutes />
      </>
    );
  }
}
