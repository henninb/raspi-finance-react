import React from "react"
import SelectAccounts from "./SelectAccounts"
import { Link } from "react-router-dom"
import "./master.scss"

export default function NavbarInstance() {
  return (
    <div className="white-div bg-primary">
      <nav className="navbar navbar-expand-sm nav-purple navbar-light fixed-top font-weight-bold">
        <Link className="navbar-brand" to="/">
          FinanceApp
        </Link>

        <ul className="navbar-nav">
          <li className="nav-item font-weight-bold">
            <Link className="nav-link" to="/payments">
              Payments
            </Link>
          </li>
          <li className="nav-item">
              <Link className="nav-link" to="/freeform">FreeForm</Link>
          </li>
          <li>
            <SelectAccounts />
          </li>
        </ul>
      </nav>
    </div>
  )
}
