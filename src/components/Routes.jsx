import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AppHeader from './AppHeader'
import TransactionTable from './TransactionTable'
import TestTable from './TestTable'

const Routes = () => (
    <div>
    <AppHeader />
    <BrowserRouter>
      <Switch>
        <Route path="/transaction" exact component={TransactionTable} />
        <Route path="/" exact component={TestTable} />
      </Switch>
    </BrowserRouter>
    </div>
);

export default Routes;
