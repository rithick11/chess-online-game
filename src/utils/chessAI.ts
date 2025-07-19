import { ChessPiece, Position, Move, PieceColor } from '@/types/chess';
import { getAllValidMoves, isCheckmate, isStalemate } from './chessLogic';

// Piece values for evaluation
const PIECE_VALUES = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
};

// Position bonus tables for different pieces
const PAWN_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

export interface AIConfig {
  depth: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export class ChessAI {
  public config: AIConfig;
  
  constructor(config: AIConfig = { depth: 3, difficulty: 'medium' }) {
    this.config = config;
    
    // Adjust depth based on difficulty
    switch (config.difficulty) {
      case 'easy':
        this.config.depth = 2;
        break;
      case 'medium':
        this.config.depth = 3;
        break;
      case 'hard':
        this.config.depth = 4;
        break;
    }
  }

  // Main AI move selection function
  public getBestMove(board: (ChessPiece | null)[][], color: PieceColor): Move | null {
    const moves = getAllValidMoves(board, color);
    
    if (moves.length === 0) {
      return null;
    }

    // For easy difficulty, add some randomness
    if (this.config.difficulty === 'easy' && Math.random() < 0.3) {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    let bestMove = moves[0];
    let bestValue = -Infinity;

    for (const move of moves) {
      const newBoard = this.makeMove(board, move);
      const value = this.minimax(newBoard, this.config.depth - 1, -Infinity, Infinity, false, color);
      
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // Minimax algorithm with alpha-beta pruning
  private minimax(
    board: (ChessPiece | null)[][],
    depth: number,
    alpha: number,
    beta: number,
    maximizing: boolean,
    aiColor: PieceColor
  ): number {
    const currentColor = maximizing ? aiColor : (aiColor === 'white' ? 'black' : 'white');
    
    if (depth === 0 || isCheckmate(board, currentColor) || isStalemate(board, currentColor)) {
      return this.evaluateBoard(board, aiColor);
    }

    const moves = getAllValidMoves(board, currentColor);

    if (maximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const newBoard = this.makeMove(board, move);
        const eval_ = this.minimax(newBoard, depth - 1, alpha, beta, false, aiColor);
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const newBoard = this.makeMove(board, move);
        const eval_ = this.minimax(newBoard, depth - 1, alpha, beta, true, aiColor);
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      return minEval;
    }
  }

  // Evaluate the current board position
  private evaluateBoard(board: (ChessPiece | null)[][], aiColor: PieceColor): number {
    let score = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          let pieceValue = PIECE_VALUES[piece.type];
          
          // Add positional bonuses
          pieceValue += this.getPositionValue(piece, row, col);
          
          if (piece.color === aiColor) {
            score += pieceValue;
          } else {
            score -= pieceValue;
          }
        }
      }
    }

    // Check for checkmate/stalemate
    if (isCheckmate(board, aiColor)) {
      score -= 10000;
    } else if (isCheckmate(board, aiColor === 'white' ? 'black' : 'white')) {
      score += 10000;
    }

    return score;
  }

  // Get positional value for a piece
  private getPositionValue(piece: ChessPiece, row: number, col: number): number {
    const adjustedRow = piece.color === 'white' ? row : 7 - row;
    
    switch (piece.type) {
      case 'pawn':
        return PAWN_TABLE[adjustedRow][col];
      case 'knight':
        return KNIGHT_TABLE[adjustedRow][col];
      default:
        return 0;
    }
  }

  // Create a new board state after making a move
  private makeMove(board: (ChessPiece | null)[][], move: Move): (ChessPiece | null)[][] {
    const newBoard = board.map(row => [...row]);
    
    // Move the piece
    newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
    newBoard[move.from.row][move.from.col] = null;
    
    // Handle castling
    if (move.isCastling && move.piece.type === 'king') {
      const rookFromCol = move.to.col > move.from.col ? 7 : 0;
      const rookToCol = move.to.col > move.from.col ? 5 : 3;
      const rook = newBoard[move.from.row][rookFromCol];
      
      if (rook) {
        newBoard[move.from.row][rookToCol] = rook;
        newBoard[move.from.row][rookFromCol] = null;
      }
    }
    
    // Handle en passant
    if (move.isEnPassant && move.piece.type === 'pawn') {
      const capturedPawnRow = move.piece.color === 'white' ? move.to.row + 1 : move.to.row - 1;
      newBoard[capturedPawnRow][move.to.col] = null;
    }
    
    return newBoard;
  }
}