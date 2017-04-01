// @flow
import {
  moveMany,
  clearChessGame,
  initWithMoves
} from './ChessGame'

import type { Action } from './Types'
import { ActionTypes } from './Types'

/** Normal action */
export const receivePlayers = (players): Action => {
  return {
    type: ActionTypes.RECEIVE_PLAYERS,
    payload: players.slice()
  }
}

/** Normal action */
export const receiveChessGames = (chessGames): Action => {
  return {
    type: ActionTypes.RECEIVE_CHESS_GAMES,
    payload: chessGames.slice()
  }
}

/** Normal action */
export const receiveChessMoves = (chessMoves): Action => {
  return {
    type: ActionTypes.RECEIVE_CHESS_MOVES,
    payload: chessMoves.slice()
  }
}

/** Normal action */
export const receiveUpdates = (players): Action => {
  return {
    type: ActionTypes.RECEIVE_UPDATES,
    payload: players.slice()
  }
}

/** Normal action */
export const selectPlayer = (player): Action => {
  return {
    type: ActionTypes.SELECT_PLAYER,
    payload: player
  }
}

/** Normal action */
export const _selectGame = (game, moves): Action => {
  return {
    type: ActionTypes.SELECT_GAME,
    payload: {
      selectedGame: game,
      moves: moves
    }
  }
}

/** Normal action */
export const expandGame = (game): Action => {
  return {
    type: ActionTypes.EXPAND_GAME,
    payload: game
  }
}

/** Normal action */
export const _challengePlayer = (player): Action => {
  return {
    type: ActionTypes.CHALLENGE_PLAYER,
    payload: player
  }
}

/** Normal action */
export const challengePlayerFailed = (player): Action => {
  return {
    type: ActionTypes.CHALLENGE_PLAYER_FAILED,
    payload: player
  }
}

/** Normal action */
export const requestUpdatesFailed = (message, displayMessage): Action => {
  return {
    type: ActionTypes.REQUEST_UPDATES_FAILED,
    payload: message
  }
}

/** Normal action */
export const requestUpdates = (updateIndex): Action => {
  return {
    type: ActionTypes.REQUEST_UPDATES,
    payload: updateIndex
  }
}

/** Normal action */
export const selectTab = (tab): Action => {
  return {
    type: ActionTypes.SELECT_TAB,
    payload: tab
  }
}

/** Thunk action */
export const selectGame = (game, moves) => dispatch => {
  dispatch(clearChessGame())
  dispatch(_selectGame(game, moves))
  dispatch(initWithMoves(moves, true))
}

/**
 * Thunk action
 * Send a challenge to the server.
 * @param {myFetch} myFetch custom fetch
 * @param {player} player Player to challenge
 * @param {player} me The challenger
 */
export const challengePlayer = (myFetch, me, player) => (dispatch, getState) => {
  console.log(me, player)
  dispatch(_challengePlayer(player))

  var body = {
    white_player_uid: me.uid,
    black_player_uid: player.uid,
    white_player_name: me.name,
    black_player_name: player.name
  }

  return myFetch('/chess-games', {
    method: 'POST',
    body: JSON.stringify(body)
  })
  .then(() => {
    let state = getState()
    dispatch(fetchUpdates(myFetch, state.updateIndex))
  })
  .catch(error => { // handle errors
    dispatch(challengePlayerFailed('Something went wrong: ' + error))
  })
}

/**
 * Thunk action
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
      dispatch(receiveChessMoves(body.chessMoves.data))

      let movesForSelectedGame = []
      Object.values(body.chessMoves.data).forEach(move => {
        if (state.selectedGame && move.chessGameId === state.selectedGame.id) {
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
