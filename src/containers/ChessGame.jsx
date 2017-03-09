import ChessGame from '../components/ChessGame'
import { connect } from 'react-redux'
import {
  setFocus,
  setVisualIndex,
  setActualIndex,
  setDisplayConfirmation,
  setChessStateHistory,
  sendMove
} from '../actions/ChessGame'

const ChessGameContainer = ((Target, namespace) => {
  const mapDispatchToProps = (dispatch) => {
    return {
      setFocus: (row, col) => {
        dispatch(setFocus(row, col))
      },
      setVisualIndex: (index) => {
        dispatch(setVisualIndex(index))
      },
      setActualIndex: (index) => {
        dispatch(setActualIndex(index))
      },
      setActualIndex: (index) => {
        dispatch(setActualIndex(index))
      },
      setDisplayConfirmation: (displayConfirmation) => {
        dispatch(setDisplayConfirmation(displayConfirmation))
      },
      setChessStateHistory: (chessStateHistory) => {
        dispatch(setChessStateHistory(chessStateHistory))
      },
      sendMove: (myFetch, move) => {
        dispatch(sendMove(myFetch, move))
      }
    }
  }

  const mapStateToProps = (state) => {
    const localState = namespace ? state[namespace] : state
    return Object.assign({}, localState)
  }

  return connect(mapStateToProps, mapDispatchToProps)(Target)
})(ChessGame, 'chessGame')

export default ChessGameContainer
