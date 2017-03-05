
import React, { PropTypes } from 'react'
import ChessGame from './containers/ChessGame'
import Lobby from './containers/Lobby'

import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import chessGameReducer from './reducers/ChessGame'
import lobbyReducer from './reducers/Lobby'
import { fetchPlayers } from './actions/Lobby'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import {
  Grid,
  Row,
  Col
} from 'react-bootstrap'

const reducer = combineReducers({
  chessGame: chessGameReducer,
  lobby: lobbyReducer
})

export default class Chess extends React.Component {
  constructor () {
    super()

    this.loggerMiddleware = createLogger()

    this.store = createStore(
      reducer,
      applyMiddleware(
          thunkMiddleware, // lets us dispatch() functions
          this.loggerMiddleware // neat middleware that logs actions
        )
    )
  }

  render () {
    return (
      <Provider store={this.store}>
        <Grid>
          <Row>
            <Col sm={12} md={6}>
              <ChessGame myColor='White'
                playerName='Player1'
                opponentName='Player2'
                gameId={-1} />
            </Col>
            <Col sm={12} md={6}>
              <Lobby myFetch={this.props.myFetch} />
            </Col>
          </Row>

        </Grid>
      </Provider>
    )
  }
}

Chess.propTypes = {
  jwToken: PropTypes.string
}
