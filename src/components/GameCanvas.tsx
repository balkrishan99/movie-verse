import { useEffect, useRef, useState, useCallback } from "react";
import { StoneType, stoneTypes } from "./InfinityStone";

interface FallingStone {
  id: number;
  type: StoneType;
  x: number;
  y: number;
  speed: number;
  rotation: number;
}

interface GameCanvasProps {
  isPlaying: boolean;
  onCollect: (type: StoneType) => void;
  onMiss: () => void;
  difficulty: number;
}

const stoneColors: Record<StoneType, string> = {
  space: '#3b82f6',
  mind: '#eab308',
  reality: '#ef4444',
  power: '#a855f7',
  time: '#22c55e',
  soul: '#f97316',
};

export const GameCanvas = ({ isPlaying, onCollect, onMiss, difficulty }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stones, setStones] = useState<FallingStone[]>([]);
  const [playerX, setPlayerX] = useState(50);
  const animationRef = useRef<number>();
  const lastSpawnRef = useRef(0);

  const spawnStone = useCallback(() => {
    const newStone: FallingStone = {
      id: Date.now() + Math.random(),
      type: stoneTypes[Math.floor(Math.random() * stoneTypes.length)],
      x: Math.random() * 80 + 10,
      y: -5,
      speed: 0.3 + difficulty * 0.1,
      rotation: 0,
    };
    setStones(prev => [...prev, newStone]);
  }, [difficulty]);

  // Handle mouse/touch movement
  useEffect(() => {
    const handleMove = (clientX: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      setPlayerX(Math.max(5, Math.min(95, x)));
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!isPlaying) {
      setStones([]);
      return;
    }

    const gameLoop = (timestamp: number) => {
      // Spawn new stones
      if (timestamp - lastSpawnRef.current > 2000 - difficulty * 200) {
        spawnStone();
        lastSpawnRef.current = timestamp;
      }

      // Update stones
      setStones(prev => {
        const updated: FallingStone[] = [];
        
        prev.forEach(stone => {
          const newY = stone.y + stone.speed;
          const newRotation = stone.rotation + 2;

          // Check collision with player
          const playerWidth = 15;
          const stoneSize = 5;
          const isColliding = 
            Math.abs(stone.x - playerX) < (playerWidth / 2 + stoneSize) &&
            newY > 85 && newY < 95;

          if (isColliding) {
            onCollect(stone.type);
            return;
          }

          // Check if stone fell off screen
          if (newY > 105) {
            onMiss();
            return;
          }

          updated.push({
            ...stone,
            y: newY,
            rotation: newRotation,
          });
        });

        return updated;
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, playerX, difficulty, onCollect, onMiss, spawnStone]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw falling stones
      stones.forEach(stone => {
        const x = (stone.x / 100) * canvas.width;
        const y = (stone.y / 100) * canvas.height;
        const size = 25;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((stone.rotation * Math.PI) / 180);

        // Draw glow
        ctx.shadowColor = stoneColors[stone.type];
        ctx.shadowBlur = 20;

        // Draw gem shape
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.8, -size * 0.3);
        ctx.lineTo(size * 0.5, size);
        ctx.lineTo(-size * 0.5, size);
        ctx.lineTo(-size * 0.8, -size * 0.3);
        ctx.closePath();
        ctx.fillStyle = stoneColors[stone.type];
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.6);
        ctx.lineTo(size * 0.4, -size * 0.1);
        ctx.lineTo(size * 0.2, size * 0.5);
        ctx.lineTo(-size * 0.2, size * 0.5);
        ctx.lineTo(-size * 0.4, -size * 0.1);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();

        ctx.restore();
      });

      // Draw player (Infinity Gauntlet collector)
      const playerXPos = (playerX / 100) * canvas.width;
      const playerY = canvas.height * 0.9;
      const gauntletWidth = 60;
      const gauntletHeight = 40;

      ctx.save();
      
      // Gauntlet glow
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 30;

      // Main gauntlet shape
      ctx.fillStyle = '#b8860b';
      ctx.beginPath();
      ctx.ellipse(playerXPos, playerY, gauntletWidth, gauntletHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Gauntlet details
      ctx.fillStyle = '#daa520';
      ctx.beginPath();
      ctx.ellipse(playerXPos, playerY - 5, gauntletWidth - 10, gauntletHeight / 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Mini stones on gauntlet
      const miniStonePositions = [
        { x: -30, color: stoneColors.space },
        { x: -15, color: stoneColors.mind },
        { x: 0, color: stoneColors.reality },
        { x: 15, color: stoneColors.power },
        { x: 30, color: stoneColors.time },
      ];

      miniStonePositions.forEach(pos => {
        ctx.beginPath();
        ctx.arc(playerXPos + pos.x, playerY - 5, 5, 0, Math.PI * 2);
        ctx.fillStyle = pos.color;
        ctx.shadowColor = pos.color;
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      ctx.restore();

      requestAnimationFrame(render);
    };

    render();
  }, [stones, playerX]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="w-full max-w-4xl h-auto rounded-lg border-2 border-primary/30 bg-background/50 backdrop-blur"
    />
  );
};
