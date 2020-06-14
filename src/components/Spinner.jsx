import React, { Component } from 'react'
import Loader from "react-loader-spinner";
import CircleLoader from 'react-spinners'

export default class Spinner extends Component {

  render() {
    return (
      <div>
        <Loader type="" color="#2BAD60" />
      </div>
    );
  }
}
