import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import TransactionTable from './TransactionTable'
import AccountSummaryTable from './AccountSummaryTable'
import NavbarInstance from "./NavbarInstance";

export default function Routes() {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <NavbarInstance/>
                </div>
                <Switch>
                    <Route path="/account-summary" exact component={AccountSummaryTable}/>
                    <Route path="/" exact component={TransactionTable}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}
