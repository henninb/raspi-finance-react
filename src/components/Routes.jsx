import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import TransactionTable from './TransactionTable'
import AccountSummaryTable from './AccountSummaryTable'

const Routes = () => (
    <div>
    <BrowserRouter>
      <Switch>
        <Route path="/account-summary" exact component={AccountSummaryTable} />
        <Route path="/" exact component={TransactionTable} />
      </Switch>
    </BrowserRouter>
    </div>
);

export default Routes;
