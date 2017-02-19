/**
 * Created by Andreas on 18.01.2017.
 */

import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import MultiplayerGame from '../MultiplayerGame'
import './Pages.scss'
import {
  Panel,
  Grid,
  Row,
  Col
} from 'react-bootstrap'
import * as fetch from 'react-native-cancelable-fetch'

export default class ChessTable extends React.Component {

  constructor () {
    super()
    this.state = {
      game: null
    }
  }

  componentWillUnmount () {
    fetch.abort(this)

    let className = document.getElementById('Title-container').className
    document.getElementById('Title-container').className = className.replace(' Hide-height', '')

    className = document.getElementById('Version-container').className
    document.getElementById('Version-container').className = className.replace(' Hide-height', '')

    this.getGamesDeferred.reject()
  }

  componentWillMount () {
    const _this = this
    const http = _this.props.route.http

    this.getGamesDeferred = http.GET('games/id/' + this.props.params.gameId, this)
    this.getGamesDeferred
      .then(result => {
        let game = result[0]

        _this.setState({
          game: game
        })
      })
  }

  componentDidMount () {
    document.getElementById('Title-container').className += ' Hide-height'
    document.getElementById('Version-container').className += ' Hide-height'
  }

  render () {
    const http = this.props.route.http

    if (this.state.game !== null) {
      let game = this.state.game
      let myName = http.player.name
      let myColor = game.player1Name === myName ?
        'White' : 'Black'
      let opponentName = game.player1Name === myName ?
        game.player2Name : game.player1Name
      let gameId = this.state.game.id

      return (
        <Grid>
          <Row>
            <Col className='Center'>
              <Panel className='Game-panel Shadow-box'>
                <MultiplayerGame myColor={myColor}
                  playerName={myName}
                  opponentName={opponentName}
                  gameId={gameId} />
              </Panel>
            </Col>
          </Row>
        </Grid>
      )
    }

    return (
      <Grid>
        <Row>
          <Col className='Center'>
            <Panel className='Game-panel Shadow-box'>
              <MultiplayerGame myColor='White'
                playerName='Player1'
                opponentName='Player2'
                gameId={-1} />
            </Panel>
          </Col>
        </Row>
      </Grid>

    )
  }
}
