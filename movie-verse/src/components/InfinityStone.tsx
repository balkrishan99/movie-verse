import { cn } from "@/lib/utils";

export type StoneType = 'space' | 'mind' | 'reality' | 'power' | 'time' | 'soul';

interface InfinityStoneProps {
  type: StoneType;
  size?: 'sm' | 'md' | 'lg';
  collected?: boolean;
  className?: string;
  onClick?: () => void;
}

const stoneConfig: Record<StoneType, { color: string; name: string }> = {
  space: { color: 'text-stone-space', name: 'Space' },
  mind: { color: 'text-stone-mind', name: 'Mind' },
  reality: { color: 'text-stone-reality', name: 'Reality' },
  power: { color: 'text-stone-power', name: 'Power' },
  time: { color: 'text-stone-time', name: 'Time' },
  soul: { color: 'text-stone-soul', name: 'Soul' },
};

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

export const InfinityStone = ({ 
  type, 
  size = 'md', 
  collected = false,
  className,
  onClick 
}: InfinityStoneProps) => {
  const config = stoneConfig[type];

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer transition-all duration-300",
        sizeClasses[size],
        collected ? "opacity-100 scale-100" : "opacity-30 scale-90",
        className
      )}
    >
      {/* Stone gem shape */}
      <svg
        viewBox="0 0 100 100"
        className={cn(
          "w-full h-full",
          config.color,
          collected && "stone-glow pulse-glow"
        )}
      >
        <polygon
          points="50,5 95,35 80,95 20,95 5,35"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Inner shine */}
        <polygon
          points="50,20 75,40 65,75 35,75 25,40"
          fill="white"
          fillOpacity="0.3"
        />
      </svg>
      
      {/* Glow effect for collected stones */}
      {collected && (
        <div 
          className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-50",
            config.color.replace('text-', 'bg-')
          )}
        />
      )}
    </div>
  );
};

export const stoneTypes: StoneType[] = ['space', 'mind', 'reality', 'power', 'time', 'soul'];
