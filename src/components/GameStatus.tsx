import { GameState, PieceColor } from '@/types/chess';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, AlertTriangle, Clock, Bot, Users } from 'lucide-react';

interface GameStatusProps {
  gameState: GameState;
}

export function GameStatus({ gameState }: GameStatusProps) {
  const { currentPlayer, isCheck, gameStatus, gameMode, aiColor, aiDifficulty } = gameState;
  
  const getStatusMessage = () => {
    if (gameStatus === 'checkmate') {
      const winner = currentPlayer === 'white' ? 'Black' : 'White';
      return {
        message: `Checkmate! ${winner} wins!`,
        icon: <Crown className="w-5 h-5" />,
        variant: 'success' as const
      };
    }
    
    if (gameStatus === 'stalemate') {
      return {
        message: 'Stalemate! The game is a draw.',
        icon: <AlertTriangle className="w-5 h-5" />,
        variant: 'warning' as const
      };
    }
    
    if (gameStatus === 'draw') {
      return {
        message: 'The game ended in a draw.',
        icon: <AlertTriangle className="w-5 h-5" />,
        variant: 'info' as const
      };
    }
    
    if (isCheck) {
      return {
        message: `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} is in check!`,
        icon: <AlertTriangle className="w-5 h-5" />,
        variant: 'danger' as const
      };
    }
    
    // Show appropriate message based on game mode
    if (gameMode === 'computer' && currentPlayer === aiColor) {
      return {
        message: 'Computer is thinking...',
        icon: <Bot className="w-5 h-5 animate-pulse" />,
        variant: 'default' as const
      };
    }
    
    const playerName = gameMode === 'computer' 
      ? (currentPlayer === aiColor ? 'Computer' : 'Your') 
      : `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s`;
    
    return {
      message: `${playerName} turn`,
      icon: <Clock className="w-5 h-5" />,
      variant: 'default' as const
    };
  };

  const status = getStatusMessage();
  
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'danger':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  return (
    <Card className={`${getVariantStyles(status.variant)} border transition-all duration-300`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {status.icon}
            <div>
              <p className="font-semibold text-lg">{status.message}</p>
              {gameStatus === 'playing' && gameMode === 'pvp' && (
                <p className="text-sm opacity-80 mt-1">
                  Click a piece to see available moves
                </p>
              )}
              {gameStatus === 'playing' && gameMode === 'computer' && currentPlayer !== aiColor && (
                <p className="text-sm opacity-80 mt-1">
                  Your turn - click a piece to move
                </p>
              )}
            </div>
          </div>
          
          {/* Game Mode Info */}
          <div className="flex items-center gap-2">
            {gameMode === 'computer' ? (
              <>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  vs AI
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {aiDifficulty}
                </Badge>
              </>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                PvP
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}