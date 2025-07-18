import { useState, useCallback, useEffect } from 'react';
import { GameState, Position, Move, ChessPiece, PieceColor } from '@/types/chess';
import { 
  createInitialBoard, 
  getValidMoves, 
  isInCheck, 
  isCheckmate, 
  isStalemate,
  generateAlgebraicNotation,
  isSamePosition
} from '@/utils/chessLogic';
import { toast } from '@/hooks/use-toast';

export function useChessGame() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    lastMove: null,
    moveHistory: [],
    capturedPieces: { white: [], black: [] },
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    gameStatus: 'playing',
    enPassantTarget: null
  }));

  // Check game state after each move
  useEffect(() => {
    const { board, currentPlayer } = gameState;
    const isCurrentPlayerInCheck = isInCheck(board, currentPlayer);
    const isCurrentPlayerCheckmate = isCheckmate(board, currentPlayer);
    const isCurrentPlayerStalemate = isStalemate(board, currentPlayer);

    setGameState(prev => ({
      ...prev,
      isCheck: isCurrentPlayerInCheck,
      isCheckmate: isCurrentPlayerCheckmate,
      isStalemate: isCurrentPlayerStalemate,
      gameStatus: isCurrentPlayerCheckmate ? 'checkmate' 
                 : isCurrentPlayerStalemate ? 'stalemate' 
                 : 'playing'
    }));

    // Show status messages
    if (isCurrentPlayerCheckmate) {
      const winner = currentPlayer === 'white' ? 'Black' : 'White';
      toast({
        title: "Checkmate!",
        description: `${winner} wins the game!`,
      });
    } else if (isCurrentPlayerStalemate) {
      toast({
        title: "Stalemate!",
        description: "The game ends in a draw.",
      });
    } else if (isCurrentPlayerInCheck) {
      toast({
        title: "Check!",
        description: `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} is in check!`,
        variant: "destructive"
      });
    }
  }, [gameState.board, gameState.currentPlayer, gameState.moveHistory.length]);

  const handleSquareClick = useCallback((position: Position) => {
    setGameState(prev => {
      const { board, selectedSquare, validMoves, currentPlayer } = prev;
      const clickedPiece = board[position.row][position.col];

      // If no piece is selected
      if (!selectedSquare) {
        if (clickedPiece && clickedPiece.color === currentPlayer) {
          const newValidMoves = getValidMoves(board, position, clickedPiece, prev.enPassantTarget);
          return {
            ...prev,
            selectedSquare: position,
            validMoves: newValidMoves
          };
        }
        return prev;
      }

      // If clicking the same square, deselect
      if (isSamePosition(selectedSquare, position)) {
        return {
          ...prev,
          selectedSquare: null,
          validMoves: []
        };
      }

      // If clicking another piece of the same color, select it
      if (clickedPiece && clickedPiece.color === currentPlayer) {
        const newValidMoves = getValidMoves(board, position, clickedPiece, prev.enPassantTarget);
        return {
          ...prev,
          selectedSquare: position,
          validMoves: newValidMoves
        };
      }

      // Try to make a move
      const isValidMove = validMoves.some(move => isSamePosition(move, position));
      if (isValidMove) {
        return makeMove(prev, selectedSquare, position);
      }

      // Invalid move, deselect
      return {
        ...prev,
        selectedSquare: null,
        validMoves: []
      };
    });
  }, []);

  const handlePieceMove = useCallback((from: Position, to: Position) => {
    setGameState(prev => {
      const { board, currentPlayer } = prev;
      const piece = board[from.row][from.col];
      
      if (!piece || piece.color !== currentPlayer) {
        return prev;
      }

      const validMoves = getValidMoves(board, from, piece, prev.enPassantTarget);
      const isValidMove = validMoves.some(move => isSamePosition(move, to));
      
      if (isValidMove) {
        return makeMove(prev, from, to);
      }

      toast({
        title: "Invalid Move",
        description: "That move is not allowed.",
        variant: "destructive"
      });

      return prev;
    });
  }, []);

  const makeMove = (prevState: GameState, from: Position, to: Position): GameState => {
    const { board, currentPlayer, capturedPieces, moveHistory } = prevState;
    const piece = board[from.row][from.col]!;
    const capturedPiece = board[to.row][to.col];
    
    // Create new board
    const newBoard = board.map(row => [...row]);
    newBoard[to.row][to.col] = { ...piece, hasMoved: true };
    newBoard[from.row][from.col] = null;

    // Handle captures
    const newCapturedPieces = { ...capturedPieces };
    if (capturedPiece) {
      newCapturedPieces[capturedPiece.color].push(capturedPiece);
    }

    // Handle en passant
    let isEnPassant = false;
    let newEnPassantTarget: Position | null = null;
    
    if (piece.type === 'pawn') {
      // Check for en passant capture
      if (prevState.enPassantTarget && isSamePosition(to, prevState.enPassantTarget)) {
        isEnPassant = true;
        const capturedPawnRow = piece.color === 'white' ? to.row + 1 : to.row - 1;
        const capturedPawn = newBoard[capturedPawnRow][to.col];
        if (capturedPawn) {
          newCapturedPieces[capturedPawn.color].push(capturedPawn);
          newBoard[capturedPawnRow][to.col] = null;
        }
      }
      
      // Set en passant target for double pawn move
      if (Math.abs(from.row - to.row) === 2) {
        newEnPassantTarget = {
          row: (from.row + to.row) / 2,
          col: from.col
        };
      }
    }

    // Handle castling
    let isCastling = false;
    if (piece.type === 'king' && Math.abs(from.col - to.col) === 2) {
      isCastling = true;
      const rookFromCol = to.col > from.col ? 7 : 0;
      const rookToCol = to.col > from.col ? 5 : 3;
      const rook = newBoard[from.row][rookFromCol];
      
      if (rook) {
        newBoard[from.row][rookToCol] = { ...rook, hasMoved: true };
        newBoard[from.row][rookFromCol] = null;
      }
    }

    // Create move object
    const move: Move = {
      from,
      to,
      piece,
      capturedPiece: capturedPiece || undefined,
      isEnPassant,
      isCastling,
      notation: generateAlgebraicNotation(board, from, to, piece)
    };

    // Switch players
    const nextPlayer: PieceColor = currentPlayer === 'white' ? 'black' : 'white';

    return {
      ...prevState,
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedSquare: null,
      validMoves: [],
      lastMove: move,
      moveHistory: [...moveHistory, move],
      capturedPieces: newCapturedPieces,
      enPassantTarget: newEnPassantTarget
    };
  };

  const newGame = useCallback(() => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 'white',
      selectedSquare: null,
      validMoves: [],
      lastMove: null,
      moveHistory: [],
      capturedPieces: { white: [], black: [] },
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      gameStatus: 'playing',
      enPassantTarget: null
    });
    
    toast({
      title: "New Game",
      description: "A new chess game has started!",
    });
  }, []);

  const undoMove = useCallback(() => {
    setGameState(prev => {
      if (prev.moveHistory.length === 0) {
        toast({
          title: "Cannot Undo",
          description: "No moves to undo.",
          variant: "destructive"
        });
        return prev;
      }

      // For simplicity, we'll rebuild from scratch for undo
      // In a production app, you'd want to store board states
      const newHistory = prev.moveHistory.slice(0, -1);
      let newState: GameState = {
        board: createInitialBoard(),
        currentPlayer: 'white',
        selectedSquare: null,
        validMoves: [],
        lastMove: null,
        moveHistory: [],
        capturedPieces: { white: [], black: [] },
        isCheck: false,
        isCheckmate: false,
        isStalemate: false,
        gameStatus: 'playing',
        enPassantTarget: null
      };

      // Replay moves
      for (const move of newHistory) {
        newState = makeMove(newState, move.from, move.to);
      }

      newState.selectedSquare = null;
      newState.validMoves = [];

      toast({
        title: "Move Undone",
        description: "Last move has been undone.",
      });

      return newState;
    });
  }, []);

  const resignGame = useCallback(() => {
    const winner = gameState.currentPlayer === 'white' ? 'Black' : 'White';
    setGameState(prev => ({
      ...prev,
      gameStatus: 'checkmate',
      selectedSquare: null,
      validMoves: []
    }));
    
    toast({
      title: "Game Resigned",
      description: `${gameState.currentPlayer.charAt(0).toUpperCase() + gameState.currentPlayer.slice(1)} resigned. ${winner} wins!`,
    });
  }, [gameState.currentPlayer]);

  const offerDraw = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'draw',
      selectedSquare: null,
      validMoves: []
    }));
    
    toast({
      title: "Draw Offered",
      description: "The game ended in a draw.",
    });
  }, []);

  const saveGame = useCallback(() => {
    try {
      const gameData = JSON.stringify(gameState);
      localStorage.setItem('chessGame', gameData);
      toast({
        title: "Game Saved",
        description: "Your game has been saved to local storage.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save the game.",
        variant: "destructive"
      });
    }
  }, [gameState]);

  const loadGame = useCallback(() => {
    try {
      const savedGame = localStorage.getItem('chessGame');
      if (savedGame) {
        const gameData = JSON.parse(savedGame);
        setGameState(gameData);
        toast({
          title: "Game Loaded",
          description: "Your saved game has been loaded.",
        });
      } else {
        toast({
          title: "No Saved Game",
          description: "No saved game found.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Could not load the saved game.",
        variant: "destructive"
      });
    }
  }, []);

  return {
    gameState,
    handleSquareClick,
    handlePieceMove,
    newGame,
    undoMove,
    resignGame,
    offerDraw,
    saveGame,
    loadGame
  };
}