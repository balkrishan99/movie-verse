import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { GameCanvas } from "@/components/GameCanvas";
import { StoneCollection } from "@/components/StoneCollection";
import { SnapEffect } from "@/components/SnapEffect";
import { StoneType, stoneTypes } from "@/components/InfinityStone";
import { toast } from "sonner";

type GameState = 'menu' | 'playing' | 'gameover' | 'victory';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [snapCount, setSnapCount] = useState(0);
  const [showSnap, setShowSnap] = useState(false);
  const [collectedStones, setCollectedStones] = useState<Record<StoneType, number>>(
    () => stoneTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {} as Record<StoneType, number>)
  );

  const allStonesCollected = stoneTypes.every(type => collectedStones[type] > 0);
  const difficulty = Math.min(5, Math.floor(score / 500) + 1);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setSnapCount(0);
    setCollectedStones(stoneTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {} as Record<StoneType, number>));
    toast("Collect the Infinity Stones!");
  };

  const handleCollect = useCallback((type: StoneType) => {
    setScore(prev => prev + 100);
    setCollectedStones(prev => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
    
    const stoneNames: Record<StoneType, string> = {
      space: '🔵 Space Stone',
      mind: '💛 Mind Stone',
      reality: '🔴 Reality Stone',
      power: '🟣 Power Stone',
      time: '🟢 Time Stone',
      soul: '🟠 Soul Stone',
    };
    toast.success(`${stoneNames[type]} collected!`);
  }, []);

  const handleMiss = useCallback(() => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameState('gameover');
        toast.error("Game Over!");
      }
      return newLives;
    });
  }, []);

  const handleSnap = () => {
    if (!allStonesCollected) return;
    
    setShowSnap(true);
    setSnapCount(prev => prev + 1);
    setScore(prev => prev + 1000);
    // Reset stones for next collection
    setCollectedStones(stoneTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {} as Record<StoneType, number>));
  };

  const handleSnapComplete = () => {
    setShowSnap(false);
    toast.success("The snap is complete! +1000 points!");
    
    if (snapCount >= 2) {
      setGameState('victory');
    }
  };

  return (
    <div className="min-h-screen cosmic-bg flex flex-col items-center justify-center p-4 overflow-hidden">
      <SnapEffect isActive={showSnap} onComplete={handleSnapComplete} />
      
      {/* Header */}
      <header className="text-center mb-8 animate-fade-in">
        <h1 className="font-display text-6xl md:text-8xl text-foreground glow-text tracking-wider">
          INFINITY QUEST
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Collect the stones. Wield the power.
        </p>
      </header>

      {/* Main Content */}
      {gameState === 'menu' && (
        <div className="flex flex-col items-center gap-8 animate-slide-up">
          <div className="text-center max-w-md">
            <p className="text-foreground/80 mb-6">
              Catch the falling Infinity Stones with your gauntlet. 
              Collect all six to perform the legendary snap!
            </p>
          </div>
          
          <StoneCollection collectedStones={collectedStones} />
          
          <Button 
            variant="gauntlet" 
            size="xl"
            onClick={startGame}
            className="mt-4"
          >
            Begin Quest
          </Button>

          <div className="text-sm text-muted-foreground mt-4">
            <p>Move mouse/finger to control the gauntlet</p>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
          {/* Stats Bar */}
          <div className="flex justify-between w-full px-4 text-foreground">
            <div className="flex gap-6">
              <span className="font-bold">
                SCORE: <span className="text-secondary">{score}</span>
              </span>
              <span className="font-bold">
                SNAPS: <span className="text-accent">{snapCount}/3</span>
              </span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <span 
                  key={i} 
                  className={`text-2xl transition-opacity ${i < lives ? 'opacity-100' : 'opacity-30'}`}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>

          {/* Stone Collection */}
          <StoneCollection collectedStones={collectedStones} />

          {/* Snap Button */}
          {allStonesCollected && (
            <Button
              variant="snap"
              size="xl"
              onClick={handleSnap}
              className="z-10"
            >
              ✨ SNAP ✨
            </Button>
          )}

          {/* Game Canvas */}
          <GameCanvas
            isPlaying={gameState === 'playing' && !showSnap}
            onCollect={handleCollect}
            onMiss={handleMiss}
            difficulty={difficulty}
          />

          <p className="text-xs text-muted-foreground">
            Difficulty Level: {difficulty}
          </p>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
          <h2 className="font-display text-5xl text-destructive">GAME OVER</h2>
          <p className="text-foreground text-xl">
            Final Score: <span className="text-secondary font-bold">{score}</span>
          </p>
          <p className="text-muted-foreground">
            Snaps Completed: {snapCount}
          </p>
          <Button variant="gauntlet" size="lg" onClick={startGame}>
            Try Again
          </Button>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="flex flex-col items-center gap-6 animate-fade-in text-center">
          <h2 className="font-display text-5xl text-secondary glow-gold">
            VICTORY!
          </h2>
          <p className="text-foreground text-xl">
            You have mastered the Infinity Stones!
          </p>
          <p className="text-2xl">
            Final Score: <span className="text-secondary font-bold">{score}</span>
          </p>
          <StoneCollection collectedStones={stoneTypes.reduce((acc, type) => ({ ...acc, [type]: 1 }), {} as Record<StoneType, number>)} />
          <Button variant="gauntlet" size="lg" onClick={startGame}>
            Play Again
          </Button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-muted-foreground text-xs">
        <p>Inspired by the Marvel Cinematic Universe</p>
      </footer>
    </div>
  );
};

export default Index;
