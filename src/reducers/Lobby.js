export const lobbyInitialState = {
  players: [],
  chessGames: [],
  updateIndex: -1,
  myEmail: null,
  myName: null,
  selectedPlayerId: null,
  selectedGameId: localStorage.getItem('selectedGameId')
}

export default function update (state = lobbyInitialState, action) {
  switch (action.type) {
    case 'RECEIVE_PLAYERS': {
      let current = state.players
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
        updateIndex: updateIndex
      })
    }

    case 'RECEIVE_CHESS_GAMES': {
      let current = state.chessGames
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
        updateIndex: updateIndex
      })
    }

    case 'SELECT_PLAYER':
      return Object.assign({}, state, {
        selectedPlayerId: action.selectedPlayer.id,
        selectedPlayer: action.selectedPlayer
      })
    case 'SELECT_GAME': {
      localStorage.setItem('selectedGameId', action.selectedGameId)

      return Object.assign({}, state, {
        selectedGameId: action.selectedGame.id
      })
    }

    case 'APP_RECEIVE_PROPS': {
      return Object.assign({}, state, {
        ...action.props
      })
    }

    default:
      return state
  }
}
