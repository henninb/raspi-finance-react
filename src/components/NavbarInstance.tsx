import React from "react";
import SelectAccounts from "./SelectAccounts";
import { Link } from "react-router-dom";
import "./main.scss";

export default function NavbarInstance() {
  return (
    <header className="top-bar js-top-bar top-bar__network">¬
      <div className="white-div bg-primary">
        <nav className="navbar navbar-expand-sm nav-purple navbar-light fixed-top font-weight-bold">
          <Link className="navbar-brand" to="/">
            FinanceApp
          </Link>

          <ul className="navbar-nav">
            <li className="nav-item font-weight-bold">
              <Link
                className="nav-link"
                to="/payments"
                data-test-id="payments-link"
              >
                Payments
              </Link>
            </li>
            <li className="nav-item font-weight-bold">
              <Link
                className="nav-link"
                to="/payment/required"
                data-test-id="payment-required-link"
              >
                PaymentRequired
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/freeform"
                data-test-id="freeform-link"
              >
                FreeForm
              </Link>
            </li>
            <li>
              <SelectAccounts />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
