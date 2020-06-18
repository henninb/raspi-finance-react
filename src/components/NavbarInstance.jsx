import React from 'react'
import SimpleSelect from './SimpleSelect'
import {Link} from "react-router-dom";

export default function NavbarInstance() {
    return (
        <div className="white-div">
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <Link className="navbar-brand" to="/">FinanceApp</Link>

                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/link2">NewTransactions</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/link3">NewAccounts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/payments">Payments</Link>
                    </li>
                    <li>
                        <SimpleSelect/>
                    </li>
                </ul>
            </nav>
        </div>
    );
}