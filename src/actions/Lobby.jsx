import {
  moveMany,
  clearChessGame,
  initWithMoves
} from './ChessGame'

export const receivePlayers = players => {
  return {
    type: 'RECEIVE_PLAYERS',
    players: players.slice()
  }
}

export const receiveChessGames = chessGames => {
  return {
    type: 'RECEIVE_CHESS_GAMES',
    chessGames: chessGames.slice()
  }
}
export const _receiveChessMoves = chessMoves => {
  return {
    type: 'RECEIVE_CHESS_MOVES',
    chessMoves: chessMoves.slice()
  }
}

export const receiveUpdates = players => {
  return {
    type: 'RECEIVE_UPDATES',
    players: players.slice()
  }
}

export const selectPlayer = player => {
  return {
    type: 'SELECT_PLAYER',
    selectedPlayer: player
  }
}

export const _selectGame = (game, moves) => {
  return {
    type: 'SELECT_GAME',
    selectedGame: game,
    moves: moves
  }
}

export const expandGame = (game) => {
  return {
    type: 'EXPAND_GAME',
    expandedGameId: game.id,
    expandedGame: game
  }
}

export const _challengePlayer = playerEmail => {
  return {
    type: 'CHALLENGE_PLAYER',
    challengedPlayerEmail: playerEmail
  }
}

export const challengePlayerFailed = playerEmail => {
  return {
    type: 'CHALLENGE_PLAYER_FAILED',
    challengedPlayerEmail: playerEmail
  }
}

export const requestUpdatesFailed = (message, displayMessage) => {
  return {
    type: 'REQUEST_UPDATES_FAILED',
    message: message
  }
}

export const requestUpdates = updateIndex => {
  return {
    type: 'REQUEST_UPDATES',
    updateIndex: updateIndex
  }
}

export const selectTab = tab => {
  return {
    type: 'SELECT_TAB',
    tab: tab
  }
}

export const selectGame = (game, moves) => dispatch => {
  dispatch(clearChessGame())
  dispatch(_selectGame(game, moves))
  dispatch(initWithMoves(moves, true))
}

export const challengePlayer = (myFetch, me, player) => dispatch => {
  console.log(me, player)
  dispatch(_challengePlayer(player.email))

  var form = new FormData()
  form.append('challenger_email', me.email)
  form.append('opponent_email', player.email)
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

export const fetchUpdates = (myFetch, updateIndex) => (dispatch, getState) => {
    // dispatch(requestUpdates(updateIndex))
  let state = getState().lobby
    // dont need the players if no change since last time
  let headers = new Headers()
  headers.append('update-index', updateIndex)

  return myFetch('/updates', {
    method: 'GET',
    headers
  }, (json, headers) => {
    if (json.players.data.length > 0) {
      dispatch(receivePlayers(json.players.data))
    }
    if (json.chessGames.data.length > 0) {
      dispatch(receiveChessGames(json.chessGames.data))
    }
    if (json.chessMoves.data.length > 0) {
      dispatch(_receiveChessMoves(json.chessMoves.data))

      let movesForSelectedGame = []
      Object.values(json.chessMoves.data).forEach(move => {
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
