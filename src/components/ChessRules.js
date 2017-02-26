/**
 * Chess rules
 *
 * Andreas Modahl
 */

// const rowLabels = '87654321';
// const colLabels = 'abcdefgh';

// unicode symbols
const w_king = '\u2654'
const w_queen = '\u2655'
const w_rook = '\u2656'
const w_bishop = '\u2657'
const w_knight = '\u2658'
const w_pawn = '\u2659'

const b_king = '\u265A'
const b_queen = '\u265B'
const b_rook = '\u265C'
const b_bishop = '\u265D'
const b_knight = '\u265E'
const b_pawn = '\u265F'

class Piece {
  constructor (unicode, color, moves) {
    this.unicode = unicode
    this.color = color
    this.moves = moves
  }

  copy () {
    return new Piece(this.unicode, this.color, this.moves)
  }

  isEmpty () {
    return this.unicode === ''
  }
}
const emptyPiece = new Piece('', '', 0)

class Move {
  constructor (fromRow, fromCol, targetRow, targetCol, number) {
    this.fromRow = fromRow
    this.fromCol = fromCol
    this.toRow = targetRow
    this.toCol = targetCol
    this.number = number
  }

  copy () {
    return new Move(this.fromRow, this.fromCol, this.toRow, this.toCol, this.number)
  }
}

/* White is bottom */
export default class ChessRules {
  constructor () {
    this.pieces = []
    this.whoseTurn = 'White'
    this.deadPieces = []
    this.moves = []
  }

  init () {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        this.pieces.push(emptyPiece.copy())
      }
    }

        // Black pieces
    let row = 0,
      col = 0
    this.pieces[col++ + row * 8] = new Piece(b_rook, 'Black', 0)
    this.pieces[col++ + row * 8] = new Piece(b_knight, 'Black', 0)
    this.pieces[col++ + row * 8] = new Piece(b_bishop, 'Black', 0)
    this.pieces[col++ + row * 8] = new Piece(b_queen, 'Black', 0)
    this.pieces[col++ + row * 8] = new Piece(b_king, 'Black', 0)
    this.pieces[col++ + row * 8] = new Piece(b_bishop, 'Black', 0)
    this.pieces[col++ + row * 8] = new Piece(b_knight, 'Black', 0)
    this.pieces[col++ + row * 8] = new Piece(b_rook, 'Black', 0)

    row = 1
    col = 0
    for (let i = 0; i < 8; i++) {
      this.pieces[col++ + row * 8] = new Piece(b_pawn, 'Black', 0)
    }

        // White pieces
    row = 7
    col = 0
    this.pieces[col++ + row * 8] = new Piece(w_rook, 'White', 0)
    this.pieces[col++ + row * 8] = new Piece(w_knight, 'White', 0)
    this.pieces[col++ + row * 8] = new Piece(w_bishop, 'White', 0)
    this.pieces[col++ + row * 8] = new Piece(w_queen, 'White', 0)
    this.pieces[col++ + row * 8] = new Piece(w_king, 'White', 0)
    this.pieces[col++ + row * 8] = new Piece(w_bishop, 'White', 0)
    this.pieces[col++ + row * 8] = new Piece(w_knight, 'White', 0)
    this.pieces[col++ + row * 8] = new Piece(w_rook, 'White', 0)

    row = 6
    col = 0
    for (let i = 0; i < 8; i++) {
      this.pieces[col++ + row * 8] = new Piece(w_pawn, 'White', 0)
    }
  }

  copy () {
    const gameState = new ChessRules()

    // copy all positions (squares)
    const copyPositions = []
    for (let i = 0; i < this.pieces.length; i++) {
      copyPositions.push(this.pieces[i].copy())
    }
    gameState.pieces = copyPositions

        // copy dead pieces
    const copyDeadPieces = []
    for (let i = 0; i < this.deadPieces.length; i++) {
      copyDeadPieces.push(this.deadPieces[i].copy())
    }
    gameState.deadPieces = copyDeadPieces

        // copy move history
    const copyMoves = []
    for (let i = 0; i < this.moves.length; i++) {
      copyMoves.push(this.moves[i].copy())
    }
    gameState.moves = copyMoves

        // copy other stuff
    gameState.whoseTurn = this.whoseTurn

    return gameState
  }

  getDeadPieces (color) {
    const dead = []
    for (let i = 0; i < this.deadPieces.length; i++) {
      if (this.deadPieces[i].color === color) {
        dead.push(this.deadPieces[i].copy())
      }
    }
    return dead
  }

  getPiece (row, col) {
    if (row < 0 || row > 7) throw new Error('Illegal row: ' + row)
    if (col < 0 || col > 7) throw new Error('Illegal column: ' + col)

    return this.pieces[col + row * 8]
  }

    // move a piece, returns a new ChessRules
    // assumes it is a valid move, see canMove(row,col,targetRow,targetCol)
  move (row, col, targetRow, targetCol) {
    row = Number(row)
    col = Number(col)
    targetRow = Number(targetRow)
    targetCol = Number(targetCol)

    const newState = this.copy()

    const enPassant = this.canEnPassant(row, col, targetRow, targetCol)
    const castling = this.canCastling(row, col, targetRow, targetCol)
    const killedPieceRow = enPassant ? row : targetRow
    const targetPiece = newState.pieces[targetCol + killedPieceRow * 8]

    if (!targetPiece.isEmpty()) {
      newState.deadPieces.push(targetPiece.copy())
    }

        // record the move
    newState.moves.push(new Move(row, col, targetRow, targetCol, newState.moves.length + 1))

        // 'move' the piece
    newState.pieces[targetCol + targetRow * 8] = this.pieces[col + row * 8].copy()
    newState.pieces[col + row * 8] = emptyPiece.copy()
    if (enPassant) {
      newState.pieces[targetCol + killedPieceRow * 8] = emptyPiece.copy()
    }
    if (castling) {
            // move rook over king
      if (targetCol === 6) {
        newState.pieces[5 + targetRow * 8] = newState.pieces[7 + targetRow * 8].copy()
        newState.pieces[7 + targetRow * 8] = emptyPiece.copy()
      }
      if (targetCol === 1) {
        newState.pieces[2 + targetRow * 8] = newState.pieces[0 + targetRow * 8].copy()
        newState.pieces[0 + targetRow * 8] = emptyPiece.copy()
      }
    }

        // upgrade pawns that make it across
    const unicode = newState.pieces[targetCol + targetRow * 8].unicode
    if (unicode === w_pawn && targetRow === 0) {
      newState.pieces[targetCol + targetRow * 8].unicode = w_queen
    } else if (unicode === b_pawn && targetRow === 7) {
      newState.pieces[targetCol + targetRow * 8].unicode = b_queen
    }

        // record how many times it has been moved
    newState.pieces[targetCol + targetRow * 8].moves++

    newState.whoseTurn = newState.whoseTurn === 'White' ? 'Black' : 'White'

    return newState
  }

    // move a piece, returns a new ChessRules
    // does not account for special behavior (en passant and castling)
    // assumes it is a valid move otherwise, see canMove(row,col,targetRow,targetCol)
  basicMove (row, col, targetRow, targetCol) {
    const newState = this.copy()

    const targetPiece = newState.pieces[targetCol + targetRow * 8]

    if (!targetPiece.isEmpty()) {
      newState.deadPieces.push(targetPiece.copy())
    }

        // record the move
    newState.moves.push(new Move(row, col, targetRow, targetCol, newState.moves.length + 1))

        // 'move' the piece
    newState.pieces[targetCol + targetRow * 8] = this.pieces[col + row * 8].copy()
    newState.pieces[col + row * 8] = emptyPiece.copy()

        // record how many times it has been moved
    newState.pieces[targetCol + targetRow * 8].moves++

    newState.whoseTurn = newState.whoseTurn === 'White' ? 'Black' : 'White'

    return newState
  }

    // whether Black king is in check
  blackCheck () {
        // determine where Black king is
    let BlackKingRow = 0,
      BlackKingCol = 0

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.pieces[col + row * 8].unicode === b_king) {
          BlackKingRow = row
          BlackKingCol = col
          break
        }
      }
    }

        // see if any enemy is attacking the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const thisPiece = this.pieces[col + row * 8]
        if (thisPiece.color !== 'White') continue

        const canMove = this.basicCanMove(row, col, BlackKingRow, BlackKingCol)
        if (canMove) return true
      }
    }

    return false
  }

    // whether White king is in check
  whiteCheck () {
        // determine where White king is
    let WhiteKingRow = 0,
      WhiteKingCol = 0

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.pieces[col + row * 8].unicode === w_king) {
          WhiteKingRow = row
          WhiteKingCol = col
          break
        }
      }
    }

        // see if any enemy is attacking the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const thisPiece = this.pieces[col + row * 8]
        if (thisPiece.color !== 'Black') continue

        const canMove = this.basicCanMove(row, col, WhiteKingRow, WhiteKingCol)
        if (canMove) return true
      }
    }

    return false
  }

    // also covers check, en passant and castling
  canMove (row, col, targetRow, targetCol) {
    if (row < 0 || row > 7) throw new Error('Illegal row: ' + row)
    if (col < 0 || col > 7) throw new Error('Illegal column: ' + col)
    if (targetRow < 0 || targetRow > 7) throw new Error('Illegal targetRow: ' + targetRow)
    if (targetCol < 0 || targetCol > 7) throw new Error('Illegal targetCol: ' + targetCol)
    if (targetRow === row && targetCol === col) return false // cannot move piece on itself

    const piece = this.pieces[col + row * 8]
    if (piece.color !== this.whoseTurn) return false // must be my turn

    const basicCanMove = this.basicCanMove(row, col, targetRow, targetCol)
    const canEnPassant = this.canEnPassant(row, col, targetRow, targetCol)
    const canCastling = this.canCastling(row, col, targetRow, targetCol)
    if (!basicCanMove && !canEnPassant && !canCastling) return false

        // copy state
    const stateCopy = this.copy()

        // update the copied state
    stateCopy.pieces[targetCol + targetRow * 8] = piece.copy()
    stateCopy.pieces[col + row * 8] = emptyPiece.copy()

        // is my king in check after this move ?
    if (piece.color === 'White' && stateCopy.whiteCheck()) return false
    if (piece.color === 'Black' && stateCopy.blackCheck()) return false

    return true
  }

  canCastling (row, col, targetRow, targetCol) {
    function castlingRules (state, row, col, targetRow, targetCol) {
      if (row < 0 || row > 7) throw new Error('Illegal row: ' + row)
      if (col < 0 || col > 7) throw new Error('Illegal column: ' + col)
      if (targetRow < 0 || targetRow > 7) throw new Error('Illegal targetRow: ' + targetRow)
      if (targetCol < 0 || targetCol > 7) throw new Error('Illegal targetCol: ' + targetCol)
      if (targetRow === row && targetCol === col) return false

      const piece = state.pieces[col + row * 8]
      const targetPiece = state.pieces[targetCol + targetRow * 8]

      if (piece === null) throw new Error('Cannot be null!!')
      if (piece.unicode === '') return false // cannot move empty piece
      if (piece.color !== state.whoseTurn) return false // must be my turn
      if (targetPiece.color !== piece.color) return false // target must be on my own team

            // Must be king and rook
      let correctPieces = piece.unicode === w_rook && targetPiece.unicode === w_king
      correctPieces |= piece.unicode === w_king && targetPiece.unicode === w_rook
      correctPieces |= piece.unicode === b_rook && targetPiece.unicode === b_king
      correctPieces |= piece.unicode === b_king && targetPiece.unicode === b_rook
      if (!correctPieces) return false

            // The king and rook involved in castling must not have previously moved
      if (piece.moves !== 0 || targetPiece.moves !== 0) return false
      if (row !== targetRow) return false // redundant

            // There must be no pieces between the king and the rook
      let leftCol = col < targetCol ? col : targetCol
      let rightCol = col > targetCol ? col : targetCol
      for (let i = leftCol + 1; i < rightCol; i++) {
        if (state.pieces[i + row * 8].unicode !== '') {
          return false
        }
      }

      const king = (piece.unicode === w_king || piece.unicode === b_king) ? piece : targetPiece
      const rook = piece === king ? targetPiece : piece
      const kingColumn = state.pieces[col + row * 8] === king ? col : targetCol
      const rookColumn = state.pieces[col + row * 8] === rook ? col : targetCol
      const kingDir = (kingColumn <= col && kingColumn <= targetCol) ? 1 : -1 // 1 right -1 left

            // The king may not currently be in check, nor may the king pass through or end up in a square that is under attack by an enemy piece
            // (though the rook is permitted to be under attack and to pass over an attacked square)
      if (king.unicode === w_king && state.whiteCheck()) return false
      if (king.unicode === b_king && state.blackCheck()) return false
      for (let i = kingColumn + kingDir; i !== rookColumn; i += kingDir) {
        const newState = state.basicMove(row, kingColumn, row, i) // makes a copy
        if (piece.color === 'white' && newState.whiteCheck()) return false
        if (piece.color === 'black' && newState.blackCheck()) return false
      }
      return true
    }

    if (row === 7 && col === 4 && targetRow === 7 && targetCol === 6) { if (castlingRules(this, 7, 4, 7, 7)) return true }
    if (row === 7 && col === 4 && targetRow === 7 && targetCol === 1) {
      if (castlingRules(this, 7, 4, 7, 0)) return true
    }

    if (row === 0 && col === 4 && targetRow === 0 && targetCol === 6) {
      if (castlingRules(this, 0, 4, 0, 7)) return true
    }
    if (row === 0 && col === 4 && targetRow === 0 && targetCol === 1) {
      if (castlingRules(this, 0, 4, 0, 0)) return true
    }

    return false
  }

  canEnPassant (row, col, targetRow, targetCol) {
    if (row < 0 || row > 7) throw new Error('Illegal row: ' + row)
    if (col < 0 || col > 7) throw new Error('Illegal column: ' + col)
    if (targetRow < 0 || targetRow > 7) throw new Error('Illegal targetRow: ' + targetRow)
    if (targetCol < 0 || targetCol > 7) throw new Error('Illegal targetCol: ' + targetCol)
    if (targetRow === row && targetCol === col) return false

    const piece = this.pieces[col + row * 8]
    const targetPiece = this.pieces[targetCol + targetRow * 8]

    if (piece === null) throw new Error('Cannot be null!!')
    if (piece.unicode === '') return false // cannot move empty piece
    if (piece.color !== this.whoseTurn) return false // must be my turn
    if (targetPiece.color === piece.color) return false // target must not be on my own team

    const unicode = piece.unicode,
      lastMove = this.moves.length > 0 ? this.moves[this.moves.length - 1] : null,
      verticalDistanceLastMove = lastMove !== null ? Math.abs(lastMove.fromRow - lastMove.toRow) : null

    function enPassantRules (state, unicode) {
      let leftCheck,
        rightCheck

      if (unicode === w_pawn) {
                // check for 'En passant' (white is bottom)
        const rowCheck = targetRow === row - 1
        rightCheck = targetCol === col + 1
                    && state.pieces[targetCol + row * 8].unicode === b_pawn

        rightCheck &= lastMove !== null && verticalDistanceLastMove === 2 && lastMove.fromCol === targetCol && lastMove.toRow === row

        leftCheck = targetCol === col - 1
                    && state.pieces[targetCol + row * 8].unicode === b_pawn

        leftCheck &= lastMove !== null && verticalDistanceLastMove === 2 && lastMove.fromCol === targetCol && lastMove.toRow === row

        if (rowCheck && (leftCheck || rightCheck)) return true
      }
      if (unicode === b_pawn) {
                // check for 'En passant' (white is bottom)
        const rowCheck = targetRow === row + 1
        rightCheck = targetCol === col + 1
                    && state.pieces[targetCol + row * 8].unicode === w_pawn

        rightCheck &= lastMove !== null && verticalDistanceLastMove === 2 && lastMove.fromCol === targetCol && lastMove.toRow === row

        leftCheck = targetCol === col - 1
                    && state.pieces[targetCol + row * 8].unicode === w_pawn

        leftCheck &= lastMove !== null && verticalDistanceLastMove === 2 && lastMove.fromCol === targetCol && lastMove.toRow === row

        if (rowCheck && (leftCheck || rightCheck)) return true
      }

      return false
    }

    if (unicode === w_pawn || unicode === b_pawn) {
      if (enPassantRules(this, unicode)) return true
    }
    return false
  }

    // only covers basic movements, does care whose turn it is
  basicCanMove (row, col, targetRow, targetCol) {
    if (row < 0 || row > 7) throw new Error('Illegal row: ' + row)
    if (col < 0 || col > 7) throw new Error('Illegal column: ' + col)
    if (targetRow < 0 || targetRow > 7) throw new Error('Illegal targetRow: ' + targetRow)
    if (targetCol < 0 || targetCol > 7) throw new Error('Illegal targetCol: ' + targetCol)
    if (targetRow === row && targetCol === col) return false

    const piece = this.pieces[col + row * 8]
    const targetPiece = this.pieces[targetCol + targetRow * 8]

    if (piece === null) throw new Error('Cannot be null!!')
    if (piece.unicode === '') return false // cannot move empty piece
    if (targetPiece.color === piece.color) return false // target must not be on my own team

    const unicode = piece.unicode,
      targetIsEmpty = targetPiece.isEmpty(),
      targetUnicode = !targetIsEmpty ? targetPiece.unicode : '',
      targetHasEnemy = targetUnicode !== unicode && !targetIsEmpty

        // pawn rules (white is bottom)
    function pawnRules (state, unicode) {
      if (unicode === w_pawn) {
        if (targetRow === row - 1 && targetCol === col && !targetHasEnemy) return true
        if (targetRow === row - 2 && row === 6 && targetCol === col && !targetHasEnemy) return true
        if (targetRow === row - 1 && (targetCol === col - 1 || targetCol === col + 1) && targetHasEnemy) return true
      }
      if (unicode === b_pawn) {
        if (targetRow === row + 1 && targetCol === col && !targetHasEnemy) return true
        if (targetRow === row + 2 && row === 1 && targetCol === col && !targetHasEnemy) return true
        if (targetRow === row + 1 && (targetCol === col - 1 || targetCol === col + 1) && targetHasEnemy) return true
      }
      return false
    }

    if (unicode === w_pawn || unicode === b_pawn) {
      if (pawnRules(this, unicode)) return true
    }

        // rook rules
    function rookRules (state, unicode) {
      let freePath

      if (row === targetRow) {
        const minCol = Math.min(col, targetCol)
        const maxCol = Math.max(col, targetCol)

        freePath = true
        for (let _col = minCol + 1; _col < maxCol; _col++) {
          const thisPiece = state.pieces[_col + row * 8]
          freePath &= thisPiece.unicode === ''
        }
        if (freePath) {
          if (targetIsEmpty || targetHasEnemy) return true
        }
      }
      if (col === targetCol) {
        const minRow = Math.min(row, targetRow)
        const maxRow = Math.max(row, targetRow)

        freePath = true
        for (let _row = minRow + 1; _row < maxRow; _row++) {
          const thisPiece = state.pieces[col + _row * 8]
          freePath &= thisPiece.unicode === ''
        }
        if (freePath) {
          if (targetIsEmpty || targetHasEnemy) return true
        }
      }
      return false
    }

    if (unicode === w_rook || unicode === b_rook) {
      if (rookRules(this, unicode)) return true
    }

        // knight rules
    function knightRules (state, unicode) {
      let onPath = Math.abs(row - targetRow) === 2 && Math.abs(col - targetCol) === 1
      onPath |= Math.abs(row - targetRow) === 1 && Math.abs(col - targetCol) === 2
      return onPath && (targetIsEmpty || targetHasEnemy)
    }

    if (unicode === w_knight || unicode === b_knight) {
      if (knightRules(this, unicode)) return true
    }

        // bishop rules
    function bishopRules (state, unicode) {
            // determine if on diagonal path
      let aligned = false,
        _row = row, _col = col,
        vDirection = targetRow - row > 0 ? 1 : -1,
        hDirection = targetCol - col > 0 ? 1 : -1

      while (_row >= 0 && _row < 8 && _col >= 0 && col < 8) {
        _row += vDirection
        _col += hDirection
        if (_row === targetRow && _col === targetCol) {
          aligned = true
        }
      }

            // determine if path is free
      let freePath = true
      if (aligned) {
        _row = row
        _col = col
        _row += vDirection
        _col += hDirection

        while (_row >= 1 && _row < 7 && _col >= 1 && _col < 7) {
          const thisPiece = state.pieces[_col + _row * 8]

          if (_row !== targetRow && thisPiece.unicode !== '') {
            freePath = false
            break
          }
          if (_row === targetRow) break
          _row += vDirection
          _col += hDirection
        }
      }

      return aligned && freePath
    }

    if (unicode === w_bishop || unicode === b_bishop) {
      if (bishopRules(this, unicode)) return true
    }

        // queen rules
    function queenRules (state, unicode) {
      return bishopRules(state, unicode) || rookRules(state, unicode)
    }

    if (unicode === w_queen || unicode === b_queen) {
      if (queenRules(this, unicode)) return true
    }

        // king rules
    function kingRules (state, unicode) {
      let hDistance = Math.abs(col - targetCol)
      let vDistance = Math.abs(row - targetRow)

      return hDistance <= 1 && vDistance <= 1 && (targetHasEnemy || targetIsEmpty)
    }

    if (unicode === w_king || unicode === b_king) {
      if (kingRules(this, unicode)) return true
    }

    return false
  }

}
