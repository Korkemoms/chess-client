/**
 * Chess implementation with network play.
 *
 * Andreas Modahl
 */

import React from 'react'
import Game from './ChessGame.jsx'
import Http from '../Http.js'
import * as fetch from 'react-native-cancelable-fetch'
const http = new Http()

export default class MultiplayerGame extends React.Component {

  constructor () {
    super()

    this.state = {
      lastMoveId: null,
      game: null,
      error: null
    }
  }

  componentWillUnmount () {
    fetch.abort(this)
  }

  handleMove (game, move, playerName) {
    const _this = this

    const multiplayerMove = {
      fromCol: move.fromCol,
      fromRow: move.fromRow,
      toCol: move.toCol,
      toRow: move.toRow,
      number: move.number,
      playerName: playerName,
      gameId: this.props.gameId
    }
    console.log('handleMove', multiplayerMove)

    http.POST('moves', multiplayerMove, this)
      .catch(result => console.log('Could not post moves', result))
  }

  fetchMoves (game) {
    const _this = this

    if (this.state.lastMoveId === null) {
      // move many pieces
      function onSuccess (result) {
        if (result.length > 0) {
          let lastId = result[result.length - 1].id
          game.moveMany(result, true)
          _this.setState({lastMoveId: lastId})
        }
      }

      http.GET('moves/' + this.props.gameId, this)
        .then((result) => onSuccess(result))
    } else {
      // move piece
      function onSuccess (result) {
        if (result.length === 0) return

        let lastId = _this.state.lastMoveId
        result.forEach(function (move) {
          if (Number(move.id) > lastId) {
            lastId = Number(move.id)
            game.move(move.fromRow, move.fromCol, move.toRow, move.toCol, move.number, true)
          }
        })
        _this.setState({lastMoveId: lastId})
      }

      http.GET('moves/id-greater-than/' + this.props.gameId + '/' +
        this.state.lastMoveId, this)
        .then(result => onSuccess(result))
        .catch(result => console.log('Could not fetch moves', result)
        )
    }
  }

  render () {
    console.log('Rendering MultiplayerGame')
    if (this.state.error !== null) {
      return <label style={{color: 'red'}}>{this.state.error}</label>
    }

    return (
      <Game myColor={this.props.myColor}
        playerName={this.props.playerName}
        opponentName={this.props.opponentName}
        onMove={(game, move, playerName) => this.handleMove(game, move, playerName)}
        onInterval={(game) => this.fetchMoves(game)}
        networkPlay
      />
    )
  }

}
