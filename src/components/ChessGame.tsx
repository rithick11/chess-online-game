import { ChessBoard } from './ChessBoard';
import { GameControls } from './GameControls';
import { MoveHistory } from './MoveHistory';
import { CapturedPieces } from './CapturedPieces';
import { GameStatus } from './GameStatus';
import { GameModeSelector } from './GameModeSelector';
import { useChessGame } from '@/hooks/useChessGame';

export function ChessGame() {
  const {
    gameState,
    handleSquareClick,
    handlePieceMove,
    newGame,
    undoMove,
    resignGame,
    offerDraw,
    saveGame
  } = useChessGame();

  const canUndo = gameState.moveHistory.length > 0;
  const isGameActive = gameState.gameStatus === 'playing';

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Royal Chess
          </h1>
          <p className="text-muted-foreground text-lg">
            A sophisticated chess experience with complete rule implementation
          </p>
        </div>

        {/* Game Mode Selector */}
        <GameModeSelector 
          onStartGame={newGame}
          currentMode={gameState.gameMode}
        />

        {/* Game Status */}
        <div className="mb-6">
          <GameStatus gameState={gameState} />
        </div>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls and Captured Pieces */}
          <div className="lg:col-span-1 space-y-6">
            <GameControls
              onNewGame={newGame}
              onUndo={undoMove}
              onResign={resignGame}
              onOfferDraw={offerDraw}
              onSaveGame={saveGame}
              canUndo={canUndo}
              isGameActive={isGameActive}
            />
            
            <CapturedPieces capturedPieces={gameState.capturedPieces} />
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-full max-w-2xl">
              <ChessBoard
                gameState={gameState}
                onSquareClick={handleSquareClick}
                onPieceMove={handlePieceMove}
              />
            </div>
          </div>

          {/* Right Sidebar - Move History */}
          <div className="lg:col-span-1">
            <MoveHistory 
              moves={gameState.moveHistory}
              onMoveClick={(moveIndex) => {
                // TODO: Implement move navigation
                console.log('Navigate to move:', moveIndex);
              }}
            />
          </div>
        </div>

        {/* Mobile Layout Adjustments */}
        <div className="lg:hidden mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <MoveHistory 
              moves={gameState.moveHistory}
              onMoveClick={(moveIndex) => {
                console.log('Navigate to move:', moveIndex);
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-muted-foreground">
          <p className="text-sm">
            Built with React, TypeScript, and Tailwind CSS • Complete chess rules implementation
          </p>
        </footer>
      </div>
    </div>
  );
}