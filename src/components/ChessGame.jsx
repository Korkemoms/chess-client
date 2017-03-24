/**
 * Andreas Modahl
 */

import '../Chess.scss'
import ChessBoard from './ChessBoard.jsx'
import React from 'react'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import wKingIcon from '../images/chess_pieces/w_king.png'
import wQueenIcon from '../images/chess_pieces/w_queen.png'
import wRookIcon from '../images/chess_pieces/w_rook.png'
import wBishopIcon from '../images/chess_pieces/w_bishop.png'
import wKnightIcon from '../images/chess_pieces/w_knight.png'
import wPawnIcon from '../images/chess_pieces/w_pawn.png'

import bKingIcon from '../images/chess_pieces/b_king.png'
import bQueenIcon from '../images/chess_pieces/b_queen.png'
import bRookIcon from '../images/chess_pieces/b_rook.png'
import bBishopIcon from '../images/chess_pieces/b_bishop.png'
import bKnightIcon from '../images/chess_pieces/b_knight.png'
import bPawnIcon from '../images/chess_pieces/b_pawn.png'

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

class ChessGame extends React.Component {

  /**
   * Starts interval calls of the function props.onInterval
   */
  componentWillMount () {
    const _this = this

    // update visualIndex if slider has been moved
    // do it in timer to avoid excessive amounts of re-renders
    // when dragging slider
    _this.timerId = window.setInterval(function () {
      let update = typeof (_this.timeSliderValue) !== 'undefined'
      update &= _this.timeSliderValue !== _this.props.visualIndex
      update &= _this.timeSliderValueConsumed === false

      if (update) {
        _this.timeSliderValueConsumed = true
        _this.props.setVisualIndex(_this.timeSliderValue)
      }
    }, 100)
  }

  /**
   * Stops interval updates
   */
  componentWillUnmount () {
    window.clearInterval(this.timerId)
  }

  forward () {
    if (this.props.visualIndex >= this.props.chessStateHistory.length) {
      return // its already max
    }

    this.props.setVisualIndex(this.props.visualIndex + 1)
  }

  now () {
    if (this.props.visualIndex === this.props.actualIndex) {
      return // its already now
    }
    this.props.setVisualIndex(this.props.actualIndex)
  }

  backward () {
    if (this.props.visualIndex <= 0) {
      return // its already min
    }
    this.props.setVisualIndex(this.props.visualIndex - 1)
  }

  sliderMoved (value) {
    this.timeSliderValue = value
    this.timeSliderValueConsumed = false
  }

  render () {
    // gather some info

    // const playerName = this.props.playerName
    // const opponentName = this.props.opponentName
    const chessStateHistory = this.props.chessStateHistory
    const visualIndex = this.props.visualIndex
    // const chessState = chessStateHistory[visualIndex]
    // const focusRow = this.props.focusRow
    // const focusCol = this.props.focusCol
    // const gotFocus = focusRow !== -1 && focusCol !== -1
    const imWhite = this.props.myColor === 'White'
    // const rotate = !imWhite
    // const lastMove = chessState.moves.length > 0
    //   ? chessState.moves[chessState.moves.length - 1] : null

    const actualIndex = this.props.actualIndex
    const actuallyMyTurn = (imWhite && actualIndex % 2 === 0) ||
      (!imWhite && actualIndex % 2 !== 0) ||
      this.props.playerUid === this.props.opponentUid

    const canConfirmMove = actuallyMyTurn && visualIndex === actualIndex + 1 &&
     this.props.gameId && this.props.gameId !== null && !this.props.spectator

    const active = this.props.gameId !== null
    const css = 'Game-container' + (active ? '' : ' inactive')

    return (
      <div id='Chess-game-container' className={css}>
        <ChessBoard
          chessStateHistory={this.props.chessStateHistory}
          visualIndex={this.props.visualIndex}
          actualIndex={this.props.actualIndex}
          focusRow={this.props.focusRow}
          focusCol={this.props.focusCol}
          displayConfirmation={this.props.displayConfirmation}
          opponentName={this.props.opponentName}
          playerName={this.props.playerName}
          onClick={(row, col) => this.props.handleClick(row, col)}
          myColor={this.props.myColor}
        />

        <div className={'Player-bar-bottom'}>
          {
            !this.props.displayConfirmation
            ? <Button disabled={this.props.visualIndex <= 0}
              style={{margin: '0 0.2em'}}
              bsStyle='primary'
              onClick={() => this.backward()}>{'<'}
            </Button>
              : ''
          }
          {
            !this.props.displayConfirmation
            ? <Button disabled={this.props.visualIndex >= this.props.chessStateHistory.length - 1}
              style={{margin: '0 0.2em'}}
              bsStyle='primary'
              onClick={() => this.forward()}>{'>'}
            </Button>
              : ''
          }

          {
            !this.props.displayConfirmation
            ? <Button
              disabled={!canConfirmMove}
              style={{margin: '0.4em 0.2em'}}
              bsStyle='primary'
              onClick={() => this.props.actuallyMove(false)}>Confirm move
              </Button>
              : ''
          }
          {
            !this.props.displayConfirmation
            ? <Button style={{margin: '0 0.2em'}}
              bsStyle='primary'
              onClick={() => this.now()}>Current
              </Button>
              : ''
          }
          {
            this.props.displayConfirmation
            ? <Button style={{margin: '0.4em 0.2em'}}
              bsStyle='warning'
              onClick={() => this.props.actuallyMove(true)}>I'm sure
              </Button>
              : ''
          }
          {
            this.props.displayConfirmation
            ? <Button style={{margin: '0.4em 0.2em'}}
              bsStyle='primary'
              onClick={() => {
                this.props.setDisplayConfirmation(false)
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
              defaultValue={this.props.visualIndex}
              value={this.props.visualIndex}
              onChange={(value) => this.sliderMoved(value)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default ChessGame
