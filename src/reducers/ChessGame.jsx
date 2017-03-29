import ChessRules from '../components/ChessRules'
import { PropTypes } from 'react'
import ChessGame from '../components/ChessGame'
import { types } from '../constants/ActionTypes'

/** Define initial Redux state and React PropTypes */
const def = (props = false) => {
  const f = props ? (_, type) => type : (val, _) => val
  let r = { // initial Redux state and React PropTypes
    focusRow: f(-1, PropTypes.number.isRequired),
    focusCol: f(-1, PropTypes.number.isRequired),
    visualIndex: f(0, PropTypes.number.isRequired),
    actualIndex: f(0, PropTypes.number.isRequired),
    gameId: f(null, PropTypes.string),
    displayConfirmation: f(false, PropTypes.bool),
    chessStateHistory: f([new ChessRules()], PropTypes.array.isRequired),
    whitePlayerUid: f(null, PropTypes.string),
    whitePlayerName: f('Player1', PropTypes.string.isRequired),
    blackPlayerUid: f(null, PropTypes.string),
    blackPlayerName: f('Player2', PropTypes.string.isRequired),
    playerUid: f(null, PropTypes.string),
    playerName: f(null, PropTypes.string),
    myColor: f('White', PropTypes.string.isRequired),
    spectator: f(true, PropTypes.bool),
    myFetch: f(null, PropTypes.func)
  }
  if (props) { // add more React PropTypes
    r = {...r}
  }
  return r
}
const initialState = def()
ChessGame.propTypes = def(true)

const update = (state = initialState, action) => {
  switch (action.type) {
    case types.chessGame.SET_FOCUS():
      return Object.assign({}, state, {
        focusRow: action.focusRow,
        focusCol: action.focusCol
      })
    case types.chessGame.SET_VISUAL_INDEX():
      return Object.assign({}, state, {
        visualIndex: action.visualIndex
      })
    case types.chessGame.SET_ACTUAL_INDEX():
      return Object.assign({}, state, {
        actualIndex: action.actualIndex
      })
    case types.chessGame.SET_DISPLAY_CONFIRMATION():
      return Object.assign({}, state, {
        displayConfirmation: action.displayConfirmation
      })
    case types.chessGame.SET_CHESS_STATE_HISTORY():
      return Object.assign({}, state, {
        chessStateHistory: action.chessStateHistory
      })
    case types.chessGame.CLEAR_CHESS_GAME(): {
      // reset most of the state
      let playerName = state.playerName
      let playerUid = state.playerUid
      let myFetch = state.myFetch

      return {
        ...def(),
        playerName,
        playerUid,
        myFetch
      }
    }
    case types.lobby.RECEIVE_CHESS_GAMES(): {
      // determine if we receive info about current game (same id)
      let received
      Object.values(action.chessGames).forEach(game => {
        if (game.id === state.gameId) {
          received = game
        }
      })

      if (!received) {
        return Object.assign({}, state)
      }

      let spectator = received.whitePlayerUid !== state.playerUid &&
        received.blackPlayerUid !== state.playerUid

      // update current game
      return Object.assign({}, state, {
        whitePlayerName: received.whitePlayerName,
        whitePlayerUid: received.whitePlayerUid,
        blackPlayerName: received.blackPlayerName,
        blackPlayerUid: received.blackPlayerUid,
        displayConfirmation: false,
        spectator: spectator
      })
    }
    case types.lobby.SELECT_GAME(): {
      // determine some values

      let selectedGame = action.selectedGame
      let spectator = selectedGame.whitePlayerUid !== state.playerUid &&
        selectedGame.blackPlayerUid !== state.playerUid

      // new game
      return Object.assign({}, state, {
        focusRow: -1,
        focusCol: -1,
        visualIndex: 0,
        actualIndex: 0,
        chessStateHistory: [new ChessRules()],
        gameId: action.selectedGame.id,
        whitePlayerName: selectedGame.whitePlayerName,
        whitePlayerUid: selectedGame.whitePlayerUid,
        blackPlayerName: selectedGame.blackPlayerName,
        blackPlayerUid: selectedGame.blackPlayerUid,
        displayConfirmation: false,
        spectator: spectator
      })
    }

    case types.app.APP_RECEIVE_PROPS(): {
      return Object.assign({}, state, {
        ...action.props
      })
    }
    default:
      return state
  }
}

export default update
