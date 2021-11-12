import React, { Component } from "react";
import AllRoutes from "./components/AllRoutes";

import moment from "moment";

require("moment");
require("moment-timezone");
moment.tz.setDefault("America/Chicago");

require("dotenv").config();

export default class App extends Component {
  render() {
    return <AllRoutes />;
  }
}
