import React, { Component } from 'react'
import SimpleSelect from './SimpleSelect'

export default class SimpleNavbar extends Component {

  render() {
    return (
     <div class="nav-div">
      <nav class="navbar navbar-expand-md navbar-light bg-light sticky-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="#logo"><img alt="" src="img/logo.png" /></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" href="#home">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#one">One</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#two">Two</a>
          </li>
          <li class="nav-item">
             <SimpleSelect />
          </li>
        </ul>
      </div>
  </div>
</nav>
    </div>
    )
  }
}
