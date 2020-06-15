import React, { Component } from 'react'
import SimpleSelect from './SimpleSelect'

export default class SimpleNavbar extends Component {

  render() {
    return (
     <div class="white-div">
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
   <a class="navbar-brand" href="#logo">FinanceApp</a>

  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" href="account-summary">AccountSummary</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#link2">NewTransactions</a>
    </li>

    <li class="nav-item">
      <a class="nav-link" href="#link3">NewAccounts</a>
    </li>
    <li>
    <SimpleSelect />
    </li>
  </ul>
</nav>
    </div>
    )
  }
}
