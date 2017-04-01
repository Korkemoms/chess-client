// @flow
import ChessGame from '../components/ChessGame'
import { connect } from 'react-redux'
import type { State } from '../reducers/ChessGame'
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

const ChessGameContainer = ((Target: Object, namespace: string) => {
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

  const mapStateToProps = (state): State => {
    const localState: State = namespace ? state[namespace] : state
    return Object.assign({}, localState)
  }

  return connect(mapStateToProps, mapDispatchToProps)(Target)
})(ChessGame, 'chessGame')

export default ChessGameContainer
