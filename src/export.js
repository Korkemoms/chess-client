
import React, { PropTypes } from 'react'
import ChessGame from './containers/ChessGame'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers/ChessGame'

import {
  Grid,
  Row,
  Col
} from 'react-bootstrap'

export default class Chess extends React.Component {

  constructor () {
    super()
    this.store = createStore(reducer)
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
              asdf
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
