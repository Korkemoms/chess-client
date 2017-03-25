import React, { PropTypes } from 'react'
import ChessGame from './containers/ChessGame'
import Lobby from './containers/Lobby'
import './App.scss'

import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import chessGameReducer from './reducers/ChessGame'
import lobbyReducer from './reducers/Lobby'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import {
  Grid,
  Row,
  Col,
  Well
} from 'react-bootstrap'

const reducer = combineReducers({
  chessGame: chessGameReducer,
  lobby: lobbyReducer
})

const loggerMiddleware = createLogger()

const store = createStore(
  reducer,
  applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware // neat middleware that logs actions
    )
)

/** Component that can be used in other react projects */
export default class Chess extends React.Component {
  componentWillMount () {
    const receiveProps = (props) => {
      return {
        type: 'APP_RECEIVE_PROPS',
        props: props
      }
    }

    store.dispatch(receiveProps(this.props))
  }

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
              <Lobby />
            </Col>
            <Col sm={12} md={6} id='Game-col'>
              <Well id='Game-well' className='Center-container'>
                <ChessGame />
              </Well>
            </Col>

          </Row>
        </Grid>
      </Provider>
    )
  }
}

Chess.propTypes = {
  myFetch: PropTypes.func,
  myUid: PropTypes.string,
  myName: PropTypes.string
}
