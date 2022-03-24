import React, { Component } from "react";
import AllRoutes from "./components/AllRoutes";
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
      <div>
        <nav class="navbar navbar-expand-lg navbar-light navbar-fixed-top">
          <a class="navbar-brand" href="#">
            Navbar
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item active">
                {" "}
                <a class="nav-link" href="/">
                  Home<span class="sr-only">(current)</span>
                </a>{" "}
              </li>
              <li class="nav-item">
                {" "}
                <a class="nav-link" href="/payments">
                  Payments
                </a>{" "}
              </li>
              <li class="nav-item">
                {" "}
                <a class="nav-link" href="/payment/required">
                  Payment Required
                </a>{" "}
              </li>
              <li class="nav-item">
                {" "}
                <a class="nav-link" href="/freeform">
                  FreeForm
                </a>{" "}
              </li>
              <li class="nav-item">
                {" "}
                <a class="nav-link" href="/login">
                  Login
                </a>{" "}
              </li>
            </ul>
          </div>
          <SelectAccounts />
        </nav>
        <AllRoutes />
      </div>
    );
  }
}
