
import React, { PropTypes } from 'react'
import ChessGame from './containers/ChessGame'
import Lobby from './containers/Lobby'

import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import chessGameReducer, { chessGameInitialState } from './reducers/ChessGame'
import lobbyReducer, { lobbyInitialState } from './reducers/Lobby'

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

const initialState = {
  chessGame: chessGameInitialState,
  lobby: lobbyInitialState
}

const loggerMiddleware = createLogger()

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware // neat middleware that logs actions
    )
)

export default class Chess extends React.Component {

  componentWillUpdate (nextProps) {
    const receiveProps = (props) => {
      return {
        type: 'APP_RECEIVE_PROPS',
        props: props
      }
    }

    store.dispatch(receiveProps(nextProps))
  }

  render () {
    return (
      <Provider store={store}>
        <Grid>
          <Row>
            <Col sm={12} md={6}>
              <ChessGame />
            </Col>
            <Col sm={12} md={6}>
              <Lobby />
            </Col>
          </Row>
        </Grid>
      </Provider>
    )
  }
}

Chess.propTypes = {
  myFetch: PropTypes.func,
  myEmail: PropTypes.string,
  myName: PropTypes.string
}
