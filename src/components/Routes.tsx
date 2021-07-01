import React from "react"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import TransactionTable from "./TransactionTable"
import AccountSummaryTable from "./AccountSummaryTable"
import PaymentTable from "./PaymentTable"
import FreeForm from "./FreeForm"
import NavbarInstance from "./NavbarInstance"
import PaymentRequired from "./PaymentRequired";
import {QueryClient, QueryClientProvider} from "react-query";

export default function Routes() {
    const queryClient = new QueryClient()
    return (
        <div>
            <Router>
                <div>
                    <NavbarInstance/>
                </div>
                <Switch>
                    <QueryClientProvider client={queryClient}>
                        <Route path="/payments" exact component={PaymentTable}/>
                        <Route path="/freeform" exact component={FreeForm}/>
                        <Route path="/payment/required" exact component={PaymentRequired}/>
                        <Route
                            path="/transactions/:account"
                            exact
                            component={TransactionTable}
                        />
                        <Route path="/" exact component={AccountSummaryTable}/>
                    </QueryClientProvider>
                </Switch>
            </Router>
        </div>
    )
}
