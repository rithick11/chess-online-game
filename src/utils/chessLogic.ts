import { ChessPiece, Position, Move, GameState, PieceType, PieceColor } from '@/types/chess';

export const PIECE_SYMBOLS = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function createInitialBoard(): (ChessPiece | null)[][] {
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place white pieces
  board[7] = [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' }
  ];
  
  for (let col = 0; col < 8; col++) {
    board[6][col] = { type: 'pawn', color: 'white' };
  }
  
  // Place black pieces
  board[0] = [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' }
  ];
  
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
  }
  
  return board;
}

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
}

export function isSamePosition(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

export function getPossibleMoves(
  board: (ChessPiece | null)[][],
  position: Position,
  piece: ChessPiece,
  enPassantTarget: Position | null = null
): Position[] {
  const moves: Position[] = [];
  const { row, col } = position;
  
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, position, piece, enPassantTarget);
    case 'rook':
      return getRookMoves(board, position, piece);
    case 'bishop':
      return getBishopMoves(board, position, piece);
    case 'queen':
      return getQueenMoves(board, position, piece);
    case 'knight':
      return getKnightMoves(board, position, piece);
    case 'king':
      return getKingMoves(board, position, piece);
    default:
      return moves;
  }
}

function getPawnMoves(
  board: (ChessPiece | null)[][],
  position: Position,
  piece: ChessPiece,
  enPassantTarget: Position | null
): Position[] {
  const moves: Position[] = [];
  const { row, col } = position;
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;
  
  // Forward move
  const newRow = row + direction;
  if (isValidPosition({ row: newRow, col }) && !board[newRow][col]) {
    moves.push({ row: newRow, col });
    
    // Double forward move from start position
    if (row === startRow && !board[newRow + direction][col]) {
      moves.push({ row: newRow + direction, col });
    }
  }
  
  // Captures
  for (const captureCol of [col - 1, col + 1]) {
    if (isValidPosition({ row: newRow, col: captureCol })) {
      const target = board[newRow][captureCol];
      if (target && target.color !== piece.color) {
        moves.push({ row: newRow, col: captureCol });
      }
      
      // En passant
      if (enPassantTarget && isSamePosition({ row: newRow, col: captureCol }, enPassantTarget)) {
        moves.push({ row: newRow, col: captureCol });
      }
    }
  }
  
  return moves;
}

function getRookMoves(board: (ChessPiece | null)[][], position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = [];
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  
  for (const [dRow, dCol] of directions) {
    for (let i = 1; i < 8; i++) {
      const newPos = { row: position.row + dRow * i, col: position.col + dCol * i };
      
      if (!isValidPosition(newPos)) break;
      
      const target = board[newPos.row][newPos.col];
      if (!target) {
        moves.push(newPos);
      } else {
        if (target.color !== piece.color) {
          moves.push(newPos);
        }
        break;
      }
    }
  }
  
  return moves;
}

function getBishopMoves(board: (ChessPiece | null)[][], position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  
  for (const [dRow, dCol] of directions) {
    for (let i = 1; i < 8; i++) {
      const newPos = { row: position.row + dRow * i, col: position.col + dCol * i };
      
      if (!isValidPosition(newPos)) break;
      
      const target = board[newPos.row][newPos.col];
      if (!target) {
        moves.push(newPos);
      } else {
        if (target.color !== piece.color) {
          moves.push(newPos);
        }
        break;
      }
    }
  }
  
  return moves;
}

function getQueenMoves(board: (ChessPiece | null)[][], position: Position, piece: ChessPiece): Position[] {
  return [...getRookMoves(board, position, piece), ...getBishopMoves(board, position, piece)];
}

function getKnightMoves(board: (ChessPiece | null)[][], position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = [];
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  
  for (const [dRow, dCol] of knightMoves) {
    const newPos = { row: position.row + dRow, col: position.col + dCol };
    
    if (isValidPosition(newPos)) {
      const target = board[newPos.row][newPos.col];
      if (!target || target.color !== piece.color) {
        moves.push(newPos);
      }
    }
  }
  
  return moves;
}

function getKingMoves(board: (ChessPiece | null)[][], position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = [];
  
  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      if (dRow === 0 && dCol === 0) continue;
      
      const newPos = { row: position.row + dRow, col: position.col + dCol };
      
      if (isValidPosition(newPos)) {
        const target = board[newPos.row][newPos.col];
        if (!target || target.color !== piece.color) {
          moves.push(newPos);
        }
      }
    }
  }
  
  return moves;
}

export function isInCheck(board: (ChessPiece | null)[][], kingColor: PieceColor): boolean {
  // Find the king
  let kingPos: Position | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === kingColor) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return false;
  
  // Check if any enemy piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== kingColor) {
        const moves = getPossibleMoves(board, { row, col }, piece);
        if (moves.some(move => isSamePosition(move, kingPos!))) {
          return true;
        }
      }
    }
  }
  
  return false;
}

export function wouldBeInCheck(
  board: (ChessPiece | null)[][],
  from: Position,
  to: Position,
  playerColor: PieceColor
): boolean {
  // Make a temporary move
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  
  return isInCheck(newBoard, playerColor);
}

export function getValidMoves(
  board: (ChessPiece | null)[][],
  position: Position,
  piece: ChessPiece,
  enPassantTarget: Position | null = null
): Position[] {
  const possibleMoves = getPossibleMoves(board, position, piece, enPassantTarget);
  
  // Filter out moves that would put own king in check
  return possibleMoves.filter(move => 
    !wouldBeInCheck(board, position, move, piece.color)
  );
}

export function getAllValidMoves(board: (ChessPiece | null)[][], color: PieceColor): Move[] {
  const moves: Move[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const validMoves = getValidMoves(board, { row, col }, piece);
        for (const to of validMoves) {
          moves.push({
            from: { row, col },
            to,
            piece,
            capturedPiece: board[to.row][to.col] || undefined,
            notation: generateAlgebraicNotation(board, { row, col }, to, piece)
          });
        }
      }
    }
  }
  
  return moves;
}

export function isCheckmate(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  return isInCheck(board, color) && getAllValidMoves(board, color).length === 0;
}

export function isStalemate(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  return !isInCheck(board, color) && getAllValidMoves(board, color).length === 0;
}

export function generateAlgebraicNotation(
  board: (ChessPiece | null)[][],
  from: Position,
  to: Position,
  piece: ChessPiece
): string {
  const fromFile = FILES[from.col];
  const fromRank = (8 - from.row).toString();
  const toFile = FILES[to.col];
  const toRank = (8 - to.row).toString();
  
  const isCapture = board[to.row][to.col] !== null;
  const pieceSymbol = piece.type === 'pawn' ? '' : piece.type.charAt(0).toUpperCase();
  
  if (piece.type === 'pawn') {
    if (isCapture) {
      return `${fromFile}x${toFile}${toRank}`;
    } else {
      return `${toFile}${toRank}`;
    }
  }
  
  const captureSymbol = isCapture ? 'x' : '';
  return `${pieceSymbol}${captureSymbol}${toFile}${toRank}`;
}