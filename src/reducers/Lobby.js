export const lobbyInitialState = {
  players: [],
  chessGames: [],
  chessMoves: {},
  updateIndex: -1,
  myUid: null,
  myName: null,
  myFetch: null,
  selectedGame: null,
  selectedPlayer: null,
  expandedGame: null,
  selectedTab: 'players'
}

export default function update (state = lobbyInitialState, action) {
  switch (action.type) {
    case 'RECEIVE_PLAYERS': {
      let current = state.players // its not copied!
      let updated = action.players

      // remove from current any that also is in updated
      current = current.filter(currentPlayer =>
         !updated.some(updatedPlayer => {
           return updatedPlayer.id === currentPlayer.id
         }))

      // get the last update index (will be used in the next query)
      let updateIndex = state.updateIndex
      updated.forEach(player => {
        if (player.updateIndex > updateIndex) {
          updateIndex = player.updateIndex
        }
      })
      let players = current.concat(updated)

      return Object.assign({}, state, {
        players: players,
        updateIndex: updateIndex // if there is change the update index will change
      })
    }

    case 'SELECT_TAB' : {
      return Object.assign({}, state, {
        selectedTab: action.tab
      })
    }

    case 'RECEIVE_CHESS_GAMES': {
      let current = state.chessGames // its not copied!
      let updated = action.chessGames

      // remove from current any that also is in updated
      current = current.filter(currentChessGame =>
         !updated.some(updatedChessGame => {
           return updatedChessGame.id === currentChessGame.id
         }))

      // get the last update index (will be used in the next query)
      let updateIndex = state.updateIndex
      updated.forEach(chessGame => {
        if (chessGame.updateIndex > updateIndex) {
          updateIndex = chessGame.updateIndex
        }
      })
      let chessGames = current.concat(updated)

      return Object.assign({}, state, {
        chessGames: chessGames,
        updateIndex: updateIndex // if there is change the update index will change
      })
    }
    case 'RECEIVE_CHESS_MOVES': {
      let local = state.chessMoves // its not copied!

      // store the moves in one object per chess game
      let updateIndex = state.updateIndex
      action.chessMoves.forEach(chessMove => {
        if (!(chessMove.chessGameId in local)) {
          local[chessMove.chessGameId] = {}
        }
        local[chessMove.chessGameId][chessMove.id] = chessMove

        if (chessMove.updateIndex > updateIndex) {
          updateIndex = chessMove.updateIndex
        }
      })

      return Object.assign({}, state, {
        chessMoves: local,
        updateIndex: updateIndex // if there is change the update index will change
      })
    }

    case 'SELECT_PLAYER': {
      let previousSelectedPlayer = state.selectedPlayer
      return Object.assign({}, state, {
        previousSelectedPlayer: previousSelectedPlayer,
        selectedPlayer: action.selectedPlayer
      })
    }

    case 'EXPAND_GAME':
      return Object.assign({}, state, {
        expandedGame: action.expandedGame
      })
    case 'SELECT_GAME':
      return Object.assign({}, state, {
        selectedGame: action.selectedGame
      })

    case 'APP_RECEIVE_PROPS': {
      return Object.assign({}, state, {
        ...action.props
      })
    }

    default:
      return state
  }
}
