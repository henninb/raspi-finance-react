import React, { Component } from "react";
import Routes from "./components/Routes";

import moment from "moment";

require("moment");
require("moment-timezone");
moment.tz.setDefault("America/Chicago");

require("dotenv").config();

export default class App extends Component {
  render() {
    return <Routes />;
  }
}
