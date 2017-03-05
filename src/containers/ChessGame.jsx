import ChessGame from '../components/ChessGame'
import { connect } from 'react-redux'
import {
  setFocus,
  setVisualIndex,
  setActualIndex,
  setDisplayConfirmation,
  setChessStateHistory
} from '../actions/ChessGame'

const ChessGameContainer = ((Target, namespace) => {
  const mapDispatchToProps = (dispatch) => {
    return {
      setFocus: (row, col) => {
        let action = setFocus(row, col)
        dispatch(action)
      },
      setVisualIndex: (index) => {
        let action = setVisualIndex(index)
        dispatch(action)
      },
      setActualIndex: (index) => {
        let action = setActualIndex(index)
        dispatch(action)
      },
      setDisplayConfirmation: (displayConfirmation) => {
        let action = setDisplayConfirmation(displayConfirmation)
        dispatch(action)
      },
      setChessStateHistory: (chessStateHistory) => {
        let action = setChessStateHistory(chessStateHistory)
        dispatch(action)
      }
    }
  }

  const mapStateToProps = (state) => {
    const localState = namespace ? state[namespace] : state
    return {
      focusRow: localState.focusRow,
      focusCol: localState.focusCol,
      visualIndex: localState.visualIndex,
      actualIndex: localState.actualIndex,
      displayConfirmation: localState.displayConfirmation,
      chessStateHistory: localState.chessStateHistory
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(Target)
})(ChessGame, 'chessGame')

export default ChessGameContainer
