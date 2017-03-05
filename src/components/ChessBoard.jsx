/**
 * Stateless chess board.
 *
 * Andreas Modahl
 */

import '../Chess.scss'
import React from 'react'

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
 * The squares of the board
 */
class Square extends React.Component {

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.number !== this.props.number ||
      nextProps.klass !== this.props.klass ||
      nextProps.disabled !== this.props.disabled
  }

  render () {
    return (
      <div className='Small-wrapper'>
        { this.props.number === 1 ? ''
          : <div className='Number-label-container'>
            <label className='Number-label'>{this.props.number}</label>
          </div> }

        <button
          disabled={this.props.disabled}
          className={this.props.klass}
          onClick={() => this.props.onClick()} />
      </div>
    )
  }
}

Square.defaultProps = {
  disabled: false,
  onClick: () => {},
  number: 1,
  klass: ''
}

/**
 * The labels around the board
 */
class Label extends React.Component {
  render () {
    return (
      <div className='Small-wrapper'>
        <div className={this.props.klass}>
          <label>
            {this.props.unicode}
          </label>
        </div>
      </div>
    )
  }
}

/**
 * Graphics for a chess board.
 */
export default class ChessBoard extends React.Component {

  render () {
    this.rowLabels = '87654321'
    this.colLabels = 'abcdefgh'

    // gather some info
    const playerName = this.props.playerName
    const opponentName = this.props.opponentName
    const chessStateHistory = this.props.chessStateHistory
    const visualIndex = this.props.visualIndex
    const chessState = chessStateHistory[visualIndex]
    const focusRow = this.props.focusRow
    const focusCol = this.props.focusCol
    const gotFocus = focusRow !== -1 && focusCol !== -1
    const imWhite = this.props.myColor === 'White'
    const rotate = !imWhite
    const lastMove = chessState.moves.length > 0
      ? chessState.moves[chessState.moves.length - 1] : null
    const actualIndex = this.props.actualIndex
    const actuallyMyTurn = (imWhite && actualIndex % 2 === 0) ||
    (!imWhite && actualIndex % 2 !== 0)
    const opponentText = opponentName + (!actuallyMyTurn
      ? ((opponentName[opponentName.length - 1] === 's' ? '\'' : '\'s') + ' turn') : '')
    const playerText = playerName + (actuallyMyTurn
      ? ((playerName[playerName.length - 1] === 's' ? '\'' : '\'s') + ' turn') : '')

    // rotate if black
    const rowIndices = rotate
      ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]
    const colIndices = rotate
      ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]

    // count white dead pieces
    let whiteDead = chessState.getDeadPieces('White')
    let whiteDeadCount = []
    whiteDead.forEach(piece => {
      if (typeof (whiteDeadCount[piece.unicode]) !== 'undefined') {
        whiteDeadCount[piece.unicode] += 1
      } else {
        whiteDeadCount[piece.unicode] = 1
      }
    })
    whiteDead = []
    Object.keys(whiteDeadCount).forEach(unicode => {
      whiteDead.push({
        count: whiteDeadCount[unicode],
        unicode: unicode
      })
    })

    // count black dead pieces
    let blackDead = chessState.getDeadPieces('Black')
    let blackDeadCount = []
    blackDead.forEach(piece => {
      if (typeof (blackDeadCount[piece.unicode]) !== 'undefined') {
        blackDeadCount[piece.unicode] += 1
      } else {
        blackDeadCount[piece.unicode] = 1
      }
    })
    blackDead = []
    Object.keys(blackDeadCount).forEach(unicode => {
      blackDead.push({
        count: blackDeadCount[unicode],
        unicode: unicode
      })
    })
    // prepare board

    let rows = []
    let key = 0

    let squares = []

    // top-left (white dead piece)
    if (whiteDead.length === 5) {
      let unicode = whiteDead[4].unicode
      let number = whiteDeadCount[unicode]
      squares.push(<Square
        klass={'Black-font Square Piece' + cssIcon[unicode]}
        number={number}
        key={key++}
        disabled />)
    } else {
      squares.push(
        <Square
          klass={'Square'}
          key={key++}
          disabled />)
    }

    rows.push(<div key={key++} className='Board-row'>{squares}</div>)

    for (let i = 0; i < 8; i++) {
      let row = rowIndices[i]

      squares = []

      // left labels (dead pieces)
      let a = 3 - i
      let b = i - 4
      if (a >= 0 && a < whiteDead.length) {
        let unicode = whiteDead[a].unicode
        let number = whiteDeadCount[unicode]
        squares.push(<Square
          klass={'Black-font Square Piece' + cssIcon[unicode]}
          number={number} key={key++}
          disabled />)
      } else if (b >= 0 && b < blackDead.length) {
        let unicode = blackDead[b].unicode
        let number = blackDeadCount[unicode]
        squares.push(<Square
          klass={'White-font Square Piece' + cssIcon[unicode]}
          number={number} key={key++}
          disabled />)
      } else {
        squares.push(<Square
          klass={'Square'}
          key={key++}
          disabled />)
      }

      // let klass = 'Label Label-left'
      // squares.push(<Label klass={klass} key={key++} unicode={this.rowLabels.charAt(row)} />)

      for (let j = 0; j < 8; j++) {
        let col = colIndices[j]

        const r = row
        const c = col
        const piece = chessState.getPiece(row, col)
        const unicode = piece.unicode

          // pieces and squares

          // checkered pattern

        let klass = ''
        let disabled = true

        // background color
        if (row % 2 === 0) {
          klass += col % 2 === 0 ? ' Color1' : ' Color2'
        } else {
          klass += col % 2 !== 0 ? ' Color1' : ' Color2'
        }
        if (gotFocus && chessState.canMove(focusRow, focusCol, row, col)) {
          klass += '-possible-move'
          disabled = false
        } else if (gotFocus && focusRow === row && focusCol === col) {
          klass += '-focus-piece'
          disabled = false
        } else if (lastMove !== null && lastMove.fromRow === row &&
            lastMove.fromCol === col) {
          klass += '-last-move'
        } else if (lastMove !== null && lastMove.toRow === row &&
            lastMove.toCol === col) {
          klass += '-last-move'
        }

          // set icon and the css properties shared by all squares
        let icon = cssIcon[unicode] !== 'undefined' ? cssIcon[unicode] : ''
        klass += ' Square Piece' + icon

        if (!gotFocus && piece.color === chessState.whoseTurn) {
          disabled = false
        }

        // border
        if (i === 0) {
          klass += ' Border-top'
        }
        if (j === 0) {
          klass += ' Border-left'
        }
        if (i === 7) {
          klass += ' Border-bot'
        }
        if (j === 7) {
          klass += ' Border-right'
        }

        squares.push(
          <Square
            key={key++}
            klass={klass}
            onClick={() => this.props.onClick(r, c)}
            disabled={disabled}
            />
        )
      }

      // right labels
      let klass = 'Label Label-right'
      squares.push(<Label
        klass={klass}
        key={key++}
        unicode={this.rowLabels.charAt(row)} />)

      rows.push(<div key={key++} className='Board-row'>{squares}</div>)
    }

    squares = []

    // bottom-left label (black dead piece)
    if (blackDead.length === 5) {
      let unicode = blackDead[4].unicode
      let number = blackDeadCount[unicode]
      squares.push(<Square
        klass={'White-font Square Piece' + cssIcon[unicode]}
        number={number}
        key={key++}
        disabled />)
    } else {
      squares.push(<Square
        klass={'Square'}
        key={key++}
        disabled />)
    }

    // bottom labels
    for (let i = 0; i < 8; i++) {
      let col = colIndices[i]

      let klass = 'Label Label-bot'
      let unicode = this.colLabels.charAt(col)
      squares.push(<Label klass={klass} key={key++} unicode={unicode} />)
    }
    rows.push(<div key={key} className='Board-row'>{squares}</div>)

    return (
      <div className='Game-container'>
        <div className='Player-bar-top'>
          <label>
            {opponentText}
          </label>
        </div>

        <div className='Big-wrapper'>
          <div className={'Game-board'}>
            {rows}
          </div>
        </div>

        <div className='Player-bar-bottom'>
          <label>
            {playerText}
          </label>
        </div>
      </div>
    )
  }
}
