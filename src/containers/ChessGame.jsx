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
  actuallyMove,
  receiveChessMoves
} from '../actions/ChessGame'

const ChessGameContainer = ((Target, namespace) => {
  const mapDispatchToProps = {
    setFocus,
    setVisualIndex,
    setActualIndex,
    setDisplayConfirmation,
    setChessStateHistory,
    sendMove,
    move,
    handleClick,
    actuallyMove,
    receiveChessMoves
  }

  const mapStateToProps = (state) => {
    const localState = namespace ? state[namespace] : state
    return Object.assign({}, localState)
  }

  return connect(mapStateToProps, mapDispatchToProps)(Target)
})(ChessGame, 'chessGame')

export default ChessGameContainer
