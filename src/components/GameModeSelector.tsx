import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PieceColor } from '@/types/chess';
import { useState } from 'react';

interface GameModeSelectorProps {
  onStartGame: (mode: 'pvp' | 'computer', aiColor?: PieceColor, difficulty?: 'easy' | 'medium' | 'hard') => void;
  currentMode: 'pvp' | 'computer';
}

export function GameModeSelector({ onStartGame, currentMode }: GameModeSelectorProps) {
  const [aiColor, setAiColor] = useState<PieceColor>('black');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Player vs Player */}
      <Card className={`cursor-pointer transition-all hover:shadow-md ${currentMode === 'pvp' ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Player vs Player</CardTitle>
            {currentMode === 'pvp' && <Badge variant="default">Active</Badge>}
          </div>
          <CardDescription>
            Local multiplayer - play against a friend on the same device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => onStartGame('pvp')}
            className="w-full"
            variant={currentMode === 'pvp' ? 'default' : 'outline'}
          >
            {currentMode === 'pvp' ? 'New PvP Game' : 'Start PvP Game'}
          </Button>
        </CardContent>
      </Card>

      {/* Player vs Computer */}
      <Card className={`cursor-pointer transition-all hover:shadow-md ${currentMode === 'computer' ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Player vs Computer</CardTitle>
            {currentMode === 'computer' && <Badge variant="default">Active</Badge>}
          </div>
          <CardDescription>
            Play against an AI opponent with adjustable difficulty
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Color</label>
            <Select value={aiColor} onValueChange={(value: PieceColor) => setAiColor(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Black (You play as White)</SelectItem>
                <SelectItem value="white">White (You play as Black)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy - Great for beginners</SelectItem>
                <SelectItem value="medium">Medium - Balanced challenge</SelectItem>
                <SelectItem value="hard">Hard - Expert level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={() => onStartGame('computer', aiColor, difficulty)}
            className="w-full"
            variant={currentMode === 'computer' ? 'default' : 'outline'}
          >
            {currentMode === 'computer' ? 'New AI Game' : 'Start AI Game'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}