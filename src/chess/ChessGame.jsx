/**
 * Chess implementation without network play.
 *
 * Andreas Modahl
 */

import './Game.scss'
import ChessBoard from './ChessBoard.jsx'
import React from 'react'
import ChessState from './Chess.js'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import wKingIcon from './images/chess_pieces/w_king.png'
import wQueenIcon from './images/chess_pieces/w_queen.png'
import wRookIcon from './images/chess_pieces/w_rook.png'
import wBishopIcon from './images/chess_pieces/w_bishop.png'
import wKnightIcon from './images/chess_pieces/w_knight.png'
import wPawnIcon from './images/chess_pieces/w_pawn.png'

import bKingIcon from './images/chess_pieces/b_king.png'
import bQueenIcon from './images/chess_pieces/b_queen.png'
import bRookIcon from './images/chess_pieces/b_rook.png'
import bBishopIcon from './images/chess_pieces/b_bishop.png'
import bKnightIcon from './images/chess_pieces/b_knight.png'
import bPawnIcon from './images/chess_pieces/b_pawn.png'

import {Button} from 'react-bootstrap'

const wKing = '\u2654'
const wQueen = '\u2655'
const wRook = '\u2656'
const wBishop = '\u2657'
const wKnight = '\u2658'
const wPawn = '\u2659'

const bKing = '\u265A'
const bQueen = '\u265B'
const bRook = '\u265C'
const bBishop = '\u265D'
const bKnight = '\u265E'
const bPawn = '\u265F'

const icon = {}
icon[wKing] = wKingIcon
icon[wQueen] = wQueenIcon
icon[wRook] = wRookIcon
icon[wBishop] = wBishopIcon
icon[wKnight] = wKnightIcon
icon[wPawn] = wPawnIcon

icon[bKing] = bKingIcon
icon[bQueen] = bQueenIcon
icon[bRook] = bRookIcon
icon[bBishop] = bBishopIcon
icon[bKnight] = bKnightIcon
icon[bPawn] = bPawnIcon

const cssIcon = {}
cssIcon[wKing] = '-w_king'
cssIcon[wQueen] = '-w_queen'
cssIcon[wRook] = '-w_rook'
cssIcon[wBishop] = '-w_bishop'
cssIcon[wKnight] = '-w_knight'
cssIcon[wPawn] = '-w_pawn'

cssIcon[bKing] = '-b_king'
cssIcon[bQueen] = '-b_queen'
cssIcon[bRook] = '-b_rook'
cssIcon[bBishop] = '-b_bishop'
cssIcon[bKnight] = '-b_knight'
cssIcon[bPawn] = '-b_pawn'

/**
 * Chess implementation without network play.
 */
export default class Game extends React.Component {

  constructor () {
    super()

    const chessState = new ChessState()
    chessState.init()
    const chessStateHistory = []
    chessStateHistory.push(chessState)

    this.state = {
      chessStateHistory: chessStateHistory,
      visualIndex: 0,
      actualIndex: 0,
      focusRow: -1,
      focusCol: -1,
      allMoves: [],
      displayConfirmation: false
    }

    this.shouldUpdate = true
  }

  /**
   * Implemented to avoid many unnecessary rendering calls.
   * @param nextProps
   * @param nextState
   * @returns boolean whether component should be re-rendered
   */
  shouldComponentUpdate (nextProps, nextState) {
    const should = this.shouldUpdate
    this.shouldUpdate = false

    return should
  }

  /**
   * Starts interval calls of the function props.onInterval
   */
  componentWillMount () {
    const _this = this

    _this.props.onInterval(_this)
    this.timerId = window.setInterval(function () {
      if (typeof (_this.props.onInterval) !== 'undefined') {
        _this.props.onInterval(_this)
      }
    }, 2000)

    // update visualIndex if slider has been moved
    // do it in timer to avoid excessive amounts of re-renders
    // when dragging slider
    _this.timerId2 = window.setInterval(function () {
      let update = typeof (_this.timeSliderValue) !== 'undefined'
      update &= _this.timeSliderValue !== _this.state.visualIndex
      update &= _this.timeSliderValueConsumed === false

      if (update) {
        _this.shouldUpdate = true
        _this.timeSliderValueConsumed = true
        _this.setState({
          visualIndex: _this.timeSliderValue
        })
      }
    }, 100)
  }

  /**
   * Stops interval updates
   */
  componentWillUnmount () {
    window.clearInterval(this.timerId)
    window.clearInterval(this.timerId2)
  }

  handleClick (row, col) {
    if (this.state === null) return
    // gather some info

    const visualIndex = this.state.visualIndex
    const chessState = this.state.chessStateHistory[visualIndex]
    const focusRow = this.state.focusRow
    const focusCol = this.state.focusCol
    const gotFocus = focusRow !== -1 && focusCol !== -1
    const haveOpponent = this.props.opponentName !== null
    const future = this.state.visualIndex >= this.state.actualIndex

    // determine what to do
    const focusPiece = gotFocus ? chessState.getPiece(focusRow, focusCol) : null
    const clickedPiece = chessState.getPiece(row, col)
    const focusColor = focusPiece !== null ? focusPiece.color : ''

    let setFocus = !clickedPiece.isEmpty()
      && !gotFocus
      && clickedPiece.color === chessState.whoseTurn
      && future
    let unFocus = gotFocus
      && focusRow === row
      && focusCol === col
      && future
    let move = focusColor === chessState.whoseTurn
      && gotFocus
      && chessState.canMove(focusRow, focusCol, row, col)
      && haveOpponent
      && future

    // do it
    if (setFocus) { // lift up the piece
      const newHistory = this.state.chessStateHistory.slice()

      this.setState({
        chessStateHistory: newHistory,
        visualIndex: visualIndex,
        focusRow: row,
        focusCol: col
      })
      this.shouldUpdate = true
    } else if (unFocus) { // put the piece back
      const newHistory = this.state.chessStateHistory.slice()

      this.setState({
        chessStateHistory: newHistory,
        visualIndex: visualIndex,
        focusRow: -1,
        focusCol: -1
      })
      this.shouldUpdate = true
    } else if (move) { // move the piece
      let lastMoveNumber = chessState.moves.length > 0 ?
        chessState.moves[chessState.moves.length - 1].number : 0

      this.move(focusRow, focusCol, row, col, lastMoveNumber + 1, false)
      this.shouldUpdate = true
    }
  }

  /**
   * Move one piece
   * @param fromRow
   * @param fromCol
   * @param toRow
   * @param toCol
   * @param number move number, to avoid performing the same move twice.
   * @param actual
   * @returns state the chess state after the moves
   */
  move (fromRow, fromCol, toRow, toCol, number, actual) {
    number = Number(number)

    const index = actual ? this.state.actualIndex : this.state.visualIndex
    const chessState = this.state.chessStateHistory[index]

    let lastMoveNumber = chessState.moves.length > 0 ? chessState.moves[chessState.moves.length - 1].number : 0

    if (number !== lastMoveNumber + 1) {
      console.log('Duplicate move (' + number + '), ignoring')
      return null
    }

    const newState = chessState.move(fromRow, fromCol, toRow, toCol)

    const newHistory = this.state.chessStateHistory.slice(0, index + 1)
    newHistory.push(newState)

    this.setState({
      chessStateHistory: newHistory,
      visualIndex: index + 1,
      actualIndex: this.state.actualIndex + (actual ? 1 : 0),
      focusRow: -1,
      focusCol: -1
    })

    this.shouldUpdate = true

    return newState
  }

  /**
   * Perform many moves
   * @param moves
   * @returns the chess state after the moves
   */
  moveMany (moves, actual) {
    if (moves.length === 0) return

    let index = actual ? this.state.actualIndex : this.state.visualIndex
    let chessState = this.state.chessStateHistory[index]
    const newHistory = this.state.chessStateHistory.slice()

    let lastMoveNumber = chessState.moves.length > 0 ? chessState.moves[chessState.moves.length - 1].number : 0

    moves.forEach(function (move) {
      let number = Number(move.number)
      if (number === lastMoveNumber + 1) {
        chessState = chessState.move(move.fromRow, move.fromCol, move.toRow, move.toCol)
        newHistory.push(chessState)
        index++
        lastMoveNumber++
      } else {
        console.log('Duplicate move (' + number + '), ignoring')
      }
    })

    this.setState({
      chessStateHistory: newHistory,
      visualIndex: index,
      actualIndex: actual ? index : this.state.actualIndex,
      focusRow: -1,
      focusCol: -1
    })

    this.shouldUpdate = true

    return chessState
  }

  forward () {
    if (this.state.visualIndex >= this.state.chessStateHistory.length) return // its already max
    this.shouldUpdate = true

    this.setState({
      visualIndex: this.state.visualIndex + 1
    })
  }

  now () {
    if (this.state.visualIndex === this.state.actualIndex) return // its already now
    this.shouldUpdate = true

    this.setState({
      visualIndex: this.state.actualIndex
    })
  }

  backward () {
    if (this.state.visualIndex <= 0) return // its already min
    this.shouldUpdate = true

    this.setState({
      visualIndex: this.state.visualIndex - 1
    })
  }

  actuallyMove (confirmed) {
    if (confirmed) {
      const chessStateHistory = this.state.chessStateHistory
      const chessState = chessStateHistory[this.state.actualIndex + 1]
      const lastMove = chessState.moves[chessState.moves.length - 1].copy()

      if (typeof (this.props.onMove) !== 'undefined') {
        this.props.onMove(this, lastMove, this.props.playerName)
      }

      this.shouldUpdate = true

      let visualIndex = this.state.actualIndex + 1
      this.setState({
        visualIndex: visualIndex,
        displayConfirmation: false,
        actualIndex: visualIndex
      })
    } else {
      this.shouldUpdate = true
      this.setState({displayConfirmation: true})
    }
  }

  sliderMoved (value) {
    this.timeSliderValue = value
    this.timeSliderValueConsumed = false
  }

  render () {
    console.log('Rendering ChessGame')

    if (this.state === null) {
      return <div><label>{'No state!'}</label></div>
    }

    // gather some info

    // const playerName = this.props.playerName
    // const opponentName = this.props.opponentName
    const chessStateHistory = this.state.chessStateHistory
    const visualIndex = this.state.visualIndex
    // const chessState = chessStateHistory[visualIndex]
    // const focusRow = this.state.focusRow
    // const focusCol = this.state.focusCol
    // const gotFocus = focusRow !== -1 && focusCol !== -1
    const imWhite = this.props.myColor === 'White'
    // const rotate = !imWhite
    // const lastMove = chessState.moves.length > 0
    //   ? chessState.moves[chessState.moves.length - 1] : null

    const actualIndex = this.state.actualIndex
    const actuallyMyTurn = (imWhite && actualIndex % 2 === 0) ||
    (!imWhite && actualIndex % 2 !== 0)

    return (
      <div className='Game-container'>
        <ChessBoard
          chessStateHistory={this.state.chessStateHistory}
          visualIndex={this.state.visualIndex}
          actualIndex={this.state.actualIndex}
          focusRow={this.state.focusRow}
          focusCol={this.state.focusCol}
          allMoves={this.state.allMoves}
          displayConfirmation={this.state.displayConfirmation}
          opponentName={this.props.opponentName}
          playerName={this.props.playerName}
          onClick={(row, col) => this.handleClick(row, col)}
        />

        <div className={'Player-bar-bottom'}>
          {
            !this.state.displayConfirmation
            ? <Button disabled={this.state.visualIndex <= 0}
              style={{margin: '0 0.2em'}}
              bsStyle='primary'
              onClick={() => this.backward()}>{'<'}
            </Button>
              : ''
          }
          {
            !this.state.displayConfirmation
            ? <Button disabled={this.state.visualIndex >= this.state.chessStateHistory.length - 1}
              style={{margin: '0 0.2em'}}
              bsStyle='primary'
              onClick={() => this.forward()}>{'>'}
            </Button>
              : ''
          }

          {
            !this.state.displayConfirmation
            ? <Button disabled={!actuallyMyTurn || visualIndex !== actualIndex + 1}
              style={{margin: '0.4em 0.2em'}}
              bsStyle='primary'
              onClick={() => this.actuallyMove(false)}>Confirm move
              </Button>
              : ''
          }
          {
            !this.state.displayConfirmation
            ? <Button style={{margin: '0 0.2em'}}
              bsStyle='primary'
              onClick={() => this.now()}>Current
              </Button>
              : ''
          }
          {
            this.state.displayConfirmation
            ? <Button style={{margin: '0.4em 0.2em'}}
              bsStyle='warning'
              onClick={() => this.actuallyMove(true)}>I'm sure
              </Button>
              : ''
          }
          {
            this.state.displayConfirmation
            ? <Button style={{margin: '0.4em 0.2em'}}
              bsStyle='primary'
              onClick={() => {
                this.shouldUpdate = true
                this.setState({displayConfirmation: false})
              }}>Cancel
              </Button>
              : ''
          }
        </div>
        <div className={'Player-bar-bottom'}>
          <div className='Time-slider-container'>
            <Slider ref={(slider) => { this.timeSlider = slider }}
              min={0}
              max={Math.max(chessStateHistory.length - 1, 0)}
              step={1}
              defaultValue={this.state.visualIndex}
              value={this.state.visualIndex}
              onChange={(value) => this.sliderMoved(value)}
            />
          </div>
        </div>

      </div>
    )
  }
}
