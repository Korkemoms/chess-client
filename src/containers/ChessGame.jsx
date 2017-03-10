import ChessGame from '../components/ChessGame'
import { connect } from 'react-redux'
import {
  setFocus,
  setVisualIndex,
  setActualIndex,
  setDisplayConfirmation,
  setChessStateHistory,
  sendMove,
  move,
  handleClick,
  actuallyMove
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
      sendMove: (...args) => {
        dispatch(sendMove(...args))
      },
      handleClick: props => (...args) => {
        dispatch(handleClick(props)(...args))
      },
      actuallyMove: props => (...args) => {
        dispatch(actuallyMove(props)(...args))
      },
      move: props => (...args) => {
        dispatch(move(props)(...args))
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
