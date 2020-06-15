import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import TransactionTable from './TransactionTable'
import AccountSummaryTable from './AccountSummaryTable'
import TestTable from './TestTable'

const Routes = () => (
    <div>
    <BrowserRouter>
      <Switch>
        <Route path="/transaction" exact component={TransactionTable} />
        <Route path="/account-summary" exact component={AccountSummaryTable} />
        <Route path="/" exact component={TestTable} />
      </Switch>
    </BrowserRouter>
    </div>
);

export default Routes;
