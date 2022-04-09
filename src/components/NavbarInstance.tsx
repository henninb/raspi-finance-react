import SelectAccounts from "./SelectAccounts";
import "./main.scss";

export default function NavbarInstance() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light navbar-fixed-top">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home<span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/payments">
                Payments
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/payment/required">
                Payment Required
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/freeform">
                FreeForm
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login">
                Login
              </a>
            </li>
          </ul>
        </div>
        <SelectAccounts />
      </nav>
    </div>
  );
}
