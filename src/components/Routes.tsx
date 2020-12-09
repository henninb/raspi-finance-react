import React from "react"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import TransactionTable from "./TransactionTable"
import AccountSummaryTable from "./AccountSummaryTable"
import PaymentTable from "./PaymentTable"
import CloneTable from "./CloneTable"
import FreeForm from "./FreeForm"
import NavbarInstance from "./NavbarInstance"

export default function Routes() {
    //let Test = () => <div className="table-formatting"><h1>test</h1></div>
    return (
        <div>
            <Router>
                <div>
                    <NavbarInstance/>
                </div>
                <Switch>
                    <Route path="/payments" exact component={PaymentTable}/>
                    <Route path="/freeform" exact component={FreeForm}/>
                    <Route path="/clone" exact component={CloneTable}/>
                    <Route
                        path="/transactions/:account"
                        exact
                        component={TransactionTable}
                    />
                    <Route path="/" exact component={AccountSummaryTable}/>
                </Switch>
            </Router>
        </div>
    )
}
