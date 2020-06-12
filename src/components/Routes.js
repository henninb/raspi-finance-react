import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AppHeader from './AppHeader'
import TransactionTable from './TransactionTable'

const Routes = () => (
    <BrowserRouter>
      <Switch>
        <Route path="/transaction" component={TransactionTable} />
        <Route path="/" component={AppHeader} />
      </Switch>
    </BrowserRouter>
);

export default Routes;
