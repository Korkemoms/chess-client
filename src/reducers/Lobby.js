import { PropTypes } from 'react'
import Lobby from '../components/Lobby'
import { types } from '../constants/ActionTypes'

/** Define initial Redux state and React PropTypes */
const def = (props = false) => {
  const f = props ? (_, type) => type : (val, _) => val
  let r = { // initial Redux state and React PropTypes
    players: f([], PropTypes.array.isRequired),
    chessGames: f([], PropTypes.array.isRequired),
    chessMoves: f({}, PropTypes.object.isRequired),
    updateIndex: f(-1, PropTypes.number.isRequired),
    playerUid: f(null, PropTypes.string),
    playerName: f(null, PropTypes.string),
    selectedGame: f(null, PropTypes.object),
    selectedPlayer: f(null, PropTypes.object),
    expandedGame: f(null, PropTypes.object),
    selectedTab: f('players', PropTypes.string.isRequired)

  }
  if (props) { // add more React PropTypes
    r = {myFetch: PropTypes.func, ...r}
  }
  return r
}
const initialState = def()
Lobby.propTypes = def(true)

export default function update (state = initialState, action) {
  switch (action.type) {
    case types.lobby.RECEIVE_PLAYERS: {
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

    case types.lobby.SELECT_TAB : {
      return Object.assign({}, state, {
        selectedTab: action.tab
      })
    }

    case types.lobby.RECEIVE_CHESS_GAMES: {
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
    case types.lobby.RECEIVE_CHESS_MOVES: {
      let local = state.chessMoves // careful, it not copied

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

    case types.lobby.SELECT_PLAYER: {
      let previousSelectedPlayer = state.selectedPlayer
      return Object.assign({}, state, {
        previousSelectedPlayer: previousSelectedPlayer,
        selectedPlayer: action.selectedPlayer
      })
    }

    case types.lobby.EXPAND_GAME:
      return Object.assign({}, state, {
        expandedGame: action.expandedGame
      })
    case types.lobby.SELECT_GAME:
      return Object.assign({}, state, {
        selectedGame: action.selectedGame
      })

    case types.app.APP_RECEIVE_PROPS: {
      return Object.assign({}, state, {
        ...action.props
      })
    }

    default:
      return state
  }
}
