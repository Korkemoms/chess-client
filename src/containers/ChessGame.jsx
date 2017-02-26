import ChessGame from '../components/ChessGame'
import { connect } from 'react-redux'
import {
  setFocus,
  setVisualIndex,
  setActualIndex,
  setDisplayConfirmation,
  setChessStateHistory
} from '../actions/ChessGame'

const mapStateToProps = (state, ownProps) => {
  return {
    focusRow: state.focusRow,
    focusCol: state.focusCol,
    visualIndex: state.visualIndex,
    actualIndex: state.actualIndex,
    displayConfirmation: state.displayConfirmation,
    chessStateHistory: state.chessStateHistory
  }
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChessGame)
