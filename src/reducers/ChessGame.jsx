import ChessRules from '../components/ChessRules'

const chessState = new ChessRules()
chessState.init()
const chessStateHistory = []
chessStateHistory.push(chessState)

const initialState = {
  focusRow: -1,
  focusCol: -1,
  visualIndex: 0,
  actualIndex: 0,
  displayConfirmation: false,
  chessStateHistory: chessStateHistory
}

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
    default:
      return state
  }
}

export default update
