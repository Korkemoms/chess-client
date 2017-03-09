import ChessRules from '../components/ChessRules'

const chessState = new ChessRules()
chessState.init()
const chessStateHistory = []
chessStateHistory.push(chessState)

export const chessGameInitialState = {
  focusRow: -1,
  focusCol: -1,
  visualIndex: 0,
  actualIndex: 0,
  myEmail: null,
  myName: null,
  displayConfirmation: false,
  chessStateHistory: chessStateHistory,
  playerName: 'Player1',
  opponentName: 'Player2',
  myColor: 'White'
}

const update = (state = chessGameInitialState, action) => {
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
    case 'SELECT_GAME': {
      let imChallenger = action.selectedGame.challengerEmail === state.myEmail
      let opponentName = imChallenger ? action.selectedGame.opponentName
        : action.selectedGame.challengerName

      return Object.assign({}, state, {
        playerName: state.myName,
        opponentName: opponentName,
        gameId: action.selectedGame.id,
        myColor: imChallenger ? 'White' : 'Black'
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
