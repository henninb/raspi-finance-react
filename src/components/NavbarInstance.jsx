import React from 'react'
import SimpleSelect from './SimpleSelect'
import {Link} from "react-router-dom";

export default function NavbarInstance() {
    return (
        <div className="white-div bg-primary">
            <nav className="navbar navbar-expand-sm bg-light navbar-light fixed-top">
                <Link className="navbar-brand" to="/">FinanceApp</Link>

                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/payments">Payments</Link>
                    </li>
                    {/*<li className="nav-item">*/}
                    {/*    <Link className="nav-link" to="/clone">Clone</Link>*/}
                    {/*</li>*/}
                    <li>
                        <SimpleSelect/>
                    </li>
                </ul>
            </nav>
        </div>
    );
}