import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import TransactionTable from './TransactionTable'
import AccountSummaryTable from './AccountSummaryTable'
import PaymentTable from './PaymentTable'
import NavbarInstance from "./NavbarInstance";

export default function Routes() {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <NavbarInstance/>
                </div>
                <Switch>
                    <Route path="/payments" exact component={PaymentTable}/>
                    <Route path="/transactions/:account" exact component={TransactionTable}/>
                    <Route path="/" exact component={AccountSummaryTable}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}