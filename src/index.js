import React from 'react'
import './index.css'
import Login from './chess/Pages/Login.jsx'
import NewAccount from './chess/Pages/NewAccount.jsx'
import AccountMustBeActivated from './chess/Pages/AccountMustBeActivated.jsx'
import ActivateAccount from './chess/Pages/ActivateAccount'
import ErrorMessage from './chess/Pages/ErrorMessage'
import {render} from 'react-dom'

import {Router, Route, useRouterHistory} from 'react-router'
import { createHistory } from 'history'

import Http from './Http.js'
const http = new Http()

import App from './chess/App'
import Lobby from './chess/Pages/Lobby'
import NotFound from './chess/Pages/NotFound'
import MyAccount from './chess/Pages/MyAccount'
import ChessTable from './chess/Pages/ChessTable'

const history = useRouterHistory(createHistory)({
  basename: '/chess'
})
render(
  <Router history={history}>
    <Route path='/' component={App} http={http}>

      <Route path='/login' component={Login} http={http} pageTitle='Log in' />
      <Route path='/error/:errorMessage/:additionalInfo' component={ErrorMessage} http={http} pageTitle='Error!' />
      <Route path='/new-account' component={NewAccount} http={http} pageTitle='New account' />
      <Route path='/account-must-be-activated/:emailAddress' component={AccountMustBeActivated} http={http}
        pageTitle='Activate account' />
      <Route path='/activate-account/:emailAddress/:token' component={ActivateAccount} http={http}
        pageTitle='Activate account' />
      <Route path='/lobby/:username' component={Lobby} http={http} pageTitle='Lobby' />
      <Route path='/my-account/:username' component={MyAccount} http={http} pageTitle='My account' />
      <Route path='/chess-table/:gameId' component={ChessTable} http={http} pageTitle='Chess table' />
      <Route path='*' component={NotFound} http={http} pageTitle='404 - Not found' />

    </Route>

  </Router>
  , document.getElementById('reactRoot')
)
