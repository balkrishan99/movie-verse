import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

interface SnapEffectProps {
  isActive: boolean;
  onComplete: () => void;
}

const colors = [
  'hsl(220, 100%, 50%)', // space
  'hsl(55, 100%, 50%)',  // mind
  'hsl(0, 100%, 50%)',   // reality
  'hsl(280, 100%, 50%)', // power
  'hsl(120, 100%, 40%)', // time
  'hsl(25, 100%, 50%)',  // soul
];

export const SnapEffect = ({ isActive, onComplete }: SnapEffectProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // Generate particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      });
    }
    setParticles(newParticles);
    setShowFlash(true);

    // Clear after animation
    const timer = setTimeout(() => {
      setParticles([]);
      setShowFlash(false);
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (!isActive && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Flash effect */}
      {showFlash && (
        <div 
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-r from-primary via-secondary to-primary",
            "animate-[flash_0.3s_ease-out_forwards]"
          )}
          style={{
            animation: 'flash 0.3s ease-out forwards',
          }}
        />
      )}

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            animation: `snap-particle 2s ease-out ${particle.delay}s forwards`,
          }}
        />
      ))}

      {/* Snap text */}
      {showFlash && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 
            className="font-display text-[20vw] text-secondary glow-gold"
            style={{
              animation: 'snap-text 1s ease-out forwards',
            }}
          >
            SNAP!
          </h1>
        </div>
      )}

      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        @keyframes snap-particle {
          0% { 
            transform: scale(1) translate(0, 0); 
            opacity: 1; 
          }
          100% { 
            transform: scale(0) translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 200}px, ${Math.random() * 200}px); 
            opacity: 0; 
          }
        }
        @keyframes snap-text {
          0% { 
            transform: scale(0.5); 
            opacity: 0; 
          }
          30% { 
            transform: scale(1.2); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
};
