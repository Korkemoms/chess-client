import {
  moveMany,
  clearChessGame,
  initWithMoves
} from './ChessGame'
import { types } from '../constants/ActionTypes'

export const receivePlayers = players => {
  return {
    type: types.lobby.RECEIVE_PLAYERS,
    players: players.slice()
  }
}

export const receiveChessGames = chessGames => {
  return {
    type: types.lobby.RECEIVE_CHESS_GAMES,
    chessGames: chessGames.slice()
  }
}
export const _receiveChessMoves = chessMoves => {
  return {
    type: types.lobby.RECEIVE_CHESS_MOVES,
    chessMoves: chessMoves.slice()
  }
}

export const receiveUpdates = players => {
  return {
    type: types.lobby.RECEIVE_UPDATES,
    players: players.slice()
  }
}

export const selectPlayer = player => {
  return {
    type: types.lobby.SELECT_PLAYER,
    selectedPlayer: player
  }
}

export const _selectGame = (game, moves) => {
  return {
    type: types.lobby.SELECT_GAME,
    selectedGame: game,
    moves: moves
  }
}

export const expandGame = (game) => {
  return {
    type: types.lobby.EXPAND_GAME,
    expandedGame: game
  }
}

export const _challengePlayer = player => {
  return {
    type: types.lobby.CHALLENGE_PLAYER,
    challengedPlayer: player
  }
}

export const challengePlayerFailed = player => {
  return {
    type: types.lobby.CHALLENGE_PLAYER_FAILED,
    challengedPlayer: player
  }
}

export const requestUpdatesFailed = (message, displayMessage) => {
  return {
    type: types.lobby.REQUEST_UPDATES_FAILED,
    message: message
  }
}

export const requestUpdates = updateIndex => {
  return {
    type: types.lobby.REQUEST_UPDATES,
    updateIndex: updateIndex
  }
}

export const selectTab = tab => {
  return {
    type: types.lobby.SELECT_TAB,
    tab: tab
  }
}

export const selectGame = (game, moves) => dispatch => {
  dispatch(clearChessGame())
  dispatch(_selectGame(game, moves))
  dispatch(initWithMoves(moves, true))
}

/**
 * @typedef {Object} player
 * @property {String} name
 */

/**
 * Send a challenge to the server.
 * @param {myFetch} myFetch custom fetch
 * @param {player} player Player to challenge
 * @param {player} me The challenger
 */
export const challengePlayer = (myFetch, me, player) => dispatch => {
  console.log(me, player)
  dispatch(_challengePlayer(player))

  var form = new FormData()
  form.append('challenger_uid', me.uid)
  form.append('opponent_uid', player.uid)
  form.append('challenger_name', me.name)
  form.append('opponent_name', player.name)

  return myFetch('/chess-games', {
    method: 'POST',
    body: form
  })
  .catch(error => { // handle errors
    dispatch(challengePlayerFailed('Something went wrong: ' + error))
  })
}

/**
 * Request updates from server, will only send you resources
 * whose updateIndex is larger than the given one.
 * @param {myFetch} myFetch custom fetch
 * @param {number} updateIndex Tells the server what you already know
 */
export const fetchUpdates = (myFetch, updateIndex) => (dispatch, getState) => {
    // dispatch(requestUpdates(updateIndex))
  let state = getState().lobby
    // dont need the players if no change since last time
  let headers = new Headers()
  headers.append('update-index', updateIndex)

  return myFetch('/updates', {
    method: 'GET',
    headers
  })
  .then(({headers, body}) => {
    // dispatch events to update redux store
    if (body.players.data.length > 0) {
      dispatch(receivePlayers(body.players.data))
    }
    if (body.chessGames.data.length > 0) {
      dispatch(receiveChessGames(body.chessGames.data))
    }
    if (body.chessMoves.data.length > 0) {
      dispatch(_receiveChessMoves(body.chessMoves.data))

      let movesForSelectedGame = []
      Object.values(body.chessMoves.data).forEach(move => {
        if (move.chessGameId === state.selectedGameId) {
          movesForSelectedGame.push(move)
        }
      })

      dispatch(moveMany(movesForSelectedGame, true))
    }
  })
  .catch(error => { // handle errors
    dispatch(requestUpdatesFailed('Something went wrong: ' + error))
  })
}
