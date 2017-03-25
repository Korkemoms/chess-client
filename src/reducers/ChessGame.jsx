import ChessRules from '../components/ChessRules'
import { PropTypes } from 'react'
import ChessGame from '../components/ChessGame'

/** Define initial Redux state and React PropTypes */
const def = (props = false) => {
  const f = props ? (_, type) => type : (val, _) => val
  let r = { // initial Redux state and React PropTypes
    focusRow: f(-1, PropTypes.number.isRequired),
    focusCol: f(-1, PropTypes.number.isRequired),
    visualIndex: f(0, PropTypes.number.isRequired),
    actualIndex: f(0, PropTypes.number.isRequired),
    myUid: f(null, PropTypes.string),
    myName: f(null, PropTypes.string),
    gameId: f(null, PropTypes.number),
    displayConfirmation: f(false, PropTypes.bool),
    chessStateHistory: f([new ChessRules()], PropTypes.array.isRequired),
    playerName: f('Player1', PropTypes.string.isRequired),
    opponentName: f('Player2', PropTypes.string.isRequired),
    myColor: f('White', PropTypes.string.isRequired),
    spectator: f(true, PropTypes.bool)

  }
  if (props) { // add more React PropTypes
    r = { ...r}
  }
  return r
}
const initialState = def()
ChessGame.propTypes = def(true)

const update = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FOCUS':
      return Object.assign({}, state, {
        focusRow: action.focusRow,
        focusCol: action.focusCol
      })
    case 'SET_VISUAL_INDEX' :
      return Object.assign({}, state, {
        visualIndex: action.visualIndex
      })
    case 'SET_ACTUAL_INDEX' :
      return Object.assign({}, state, {
        actualIndex: action.actualIndex
      })
    case 'SET_DISPLAY_CONFIRMATION' :
      return Object.assign({}, state, {
        displayConfirmation: action.displayConfirmation
      })
    case 'SET_CHESS_STATE_HISTORY' :
      return Object.assign({}, state, {
        chessStateHistory: action.chessStateHistory
      })
    case 'CLEAR_CHESS_GAME' : {
      // blank game
      return def()
    }

    case 'RECEIVE_CHESS_GAMES': {
      let current = state // careful, its not copied

      // determine if we receive info about current game (same id)
      let received
      Object.values(action.chessGames).forEach(game => {
        if (game.id === current.gameId) {
          received = game
        }
      })

      if (!received) {
        return Object.assign({}, state)
      }

      // we received info about current game

      // determine some values
      let imChallenger = received.challengerUid === state.myUid
      let playerName = !imChallenger ? received.opponentName
      : received.challengerName
      let playerUid = !imChallenger ? received.opponentUid
      : received.challengerUid
      let opponentName = imChallenger ? received.opponentName
      : received.challengerName
      let opponentUid = imChallenger ? received.opponentUid
      : received.challengerUid
      let spectator = opponentUid !== state.myUid && playerUid !== state.myUid

      // copy info received into current game
      return Object.assign({}, state, {
        playerName: playerName,
        playerUid: playerUid,
        opponentName: opponentName,
        opponentUid: opponentUid,
        displayConfirmation: false,
        myColor: imChallenger ? 'White' : 'Black',
        spectator: spectator
      })
    }

    case 'SELECT_GAME': {
      // determine some values
      let imChallenger = action.selectedGame.challengerUid === state.myUid
      let playerName = !imChallenger ? action.selectedGame.opponentName
        : action.selectedGame.challengerName
      let playerUid = !imChallenger ? action.selectedGame.opponentUid
          : action.selectedGame.challengerUid
      let opponentName = imChallenger ? action.selectedGame.opponentName
        : action.selectedGame.challengerName
      let opponentUid = imChallenger ? action.selectedGame.opponentUid
          : action.selectedGame.challengerUid
      let spectator = opponentUid !== state.myUid &&
        playerUid !== state.myUid

      // new game
      return Object.assign({}, state, {
        focusRow: -1,
        focusCol: -1,
        visualIndex: 0,
        actualIndex: 0,
        playerName: playerName,
        playerUid: playerUid,
        opponentName: opponentName,
        opponentUid: opponentUid,
        chessStateHistory: [new ChessRules()],
        gameId: action.selectedGame.id,
        displayConfirmation: false,
        myColor: imChallenger ? 'White' : 'Black',
        spectator: spectator
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

export default update
