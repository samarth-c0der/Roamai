import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, VolumeX, Snowflake, Wind, Sparkles, Sliders } from 'lucide-react';

interface FlakeData {
  id: number;
  left: number; // 0 - 100%
  size: number; // px
  duration: number; // s
  delay: number; // s (negative for instant start)
  swayDuration: number; // s
  swayDistance: number; // px
  opacity: number;
  blur: number; // px
  type: 'crystal' | 'dot' | 'large' | 'powder';
  rotationSpeed: number; // s
  rotationDirection: number; // 1 or -1
}

interface SnowfallEffectProps {
  density?: 'gentle' | 'normal' | 'blizzard';
  className?: string;
  speedMultiplier?: number;
  fullScreen?: boolean;
}

export const SnowfallEffect: React.FC<SnowfallEffectProps> = ({
  density = 'normal',
  className = '',
  speedMultiplier = 1,
  fullScreen = false,
}) => {
  const flakeCount = useMemo(() => {
    switch (density) {
      case 'gentle':
        return 30;
      case 'blizzard':
        return 75;
      case 'normal':
      default:
        return 50;
    }
  }, [density]);

  // Deterministic yet random-looking flakes to avoid hydration/render re-calculations
  const flakes = useMemo<FlakeData[]>(() => {
    const list: FlakeData[] = [];
    for (let i = 0; i < flakeCount; i++) {
      const seed = (i * 9301 + 49297) % 233280;
      const rnd1 = seed / 233280;
      const rnd2 = ((i * 12345 + 6789) % 233280) / 233280;
      const rnd3 = ((i * 54321 + 9876) % 233280) / 233280;
      const rnd4 = ((i * 24680 + 13579) % 233280) / 233280;

      let type: 'crystal' | 'dot' | 'large' | 'powder' = 'dot';
      let size = 5;
      let blur = 0;
      let opacity = 0.8;
      let duration = 6;

      if (i % 6 === 0) {
        // Crisp snowflake crystal
        type = 'crystal';
        size = 12 + rnd1 * 10; // 12px - 22px
        opacity = 0.85 + rnd2 * 0.15;
        duration = (8 + rnd3 * 6) / speedMultiplier;
        blur = 0;
      } else if (i % 7 === 1) {
        // Large blurry foreground flake
        type = 'large';
        size = 14 + rnd1 * 14; // 14px - 28px
        opacity = 0.4 + rnd2 * 0.3;
        duration = (4 + rnd3 * 3.5) / speedMultiplier; // Falls faster
        blur = 1.8;
      } else if (i % 3 === 0) {
        // Tiny drifting powder
        type = 'powder';
        size = 2 + rnd1 * 3; // 2px - 5px
        opacity = 0.5 + rnd2 * 0.4;
        duration = (9 + rnd3 * 7) / speedMultiplier;
        blur = 0;
      } else {
        // Standard fluffy snow dot
        type = 'dot';
        size = 4 + rnd1 * 6; // 4px - 10px
        opacity = 0.7 + rnd2 * 0.3;
        duration = (6 + rnd3 * 5) / speedMultiplier;
        blur = 0.4;
      }

      list.push({
        id: i,
        left: (i / flakeCount) * 100 + (rnd1 * 8 - 4),
        size,
        duration,
        delay: -(rnd2 * 12), // Start immediately at various points in fall cycle
        swayDuration: 3 + rnd3 * 3.5,
        swayDistance: (i % 2 === 0 ? 1 : -1) * (15 + rnd4 * 30),
        opacity,
        blur,
        type,
        rotationSpeed: 6 + rnd4 * 10,
        rotationDirection: i % 2 === 0 ? 1 : -1,
      });
    }
    return list;
  }, [flakeCount, speedMultiplier]);

  return (
    <div
      className={`pointer-events-none overflow-hidden select-none ${
        fullScreen ? 'fixed inset-0 z-20' : 'absolute inset-0 z-0'
      } ${className}`}
      aria-hidden="true"
    >
      {/* Glacial Frost Ambient Atmosphere Gradient at the top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-sky-200/20 dark:from-sky-900/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sky-100/30 dark:from-slate-900/40 via-sky-50/15 to-transparent pointer-events-none" />

      {/* Floating Snowflakes */}
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-0 will-change-transform"
          style={{
            left: `${Math.max(0, Math.min(100, flake.left))}%`,
            animation: `snowfallFall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          <div
            style={{
              animation: `snowfallSway ${flake.swayDuration}s ease-in-out infinite alternate`,
              transform: `translateX(${flake.swayDistance}px)`,
            }}
          >
            {flake.type === 'crystal' ? (
              <div
                style={{
                  width: `${flake.size}px`,
                  height: `${flake.size}px`,
                  opacity: flake.opacity,
                  filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                  animation: `snowfallSpin ${flake.rotationSpeed}s linear infinite ${
                    flake.rotationDirection < 0 ? 'reverse' : 'normal'
                  }`,
                }}
                className="text-white flex items-center justify-center"
              >
                <SnowflakeSvg size={flake.size} />
              </div>
            ) : (
              <div
                className="rounded-full bg-white"
                style={{
                  width: `${flake.size}px`,
                  height: `${flake.size}px`,
                  opacity: flake.opacity,
                  filter:
                    flake.blur > 0
                      ? `blur(${flake.blur}px) drop-shadow(0 0 3px rgba(255, 255, 255, 0.9))`
                      : 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.85))',
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 6-pointed symmetrical SVG Snowflake Crystal
 */
const SnowflakeSvg: React.FC<{ size: number }> = ({ size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-sky-100 dark:text-sky-200"
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="3.34" y1="7" x2="20.66" y2="17" />
      <line x1="3.34" y1="17" x2="20.66" y2="7" />
      {/* V-branches */}
      <polyline points="9 4 12 7 15 4" />
      <polyline points="9 20 12 17 15 20" />
      <polyline points="4.5 9.5 7.5 11 9 8" />
      <polyline points="19.5 14.5 16.5 13 15 16" />
      <polyline points="4.5 14.5 7.5 13 9 16" />
      <polyline points="19.5 9.5 16.5 11 15 8" />
    </svg>
  );
};

/**
 * Interactive Snow Atmosphere Pill
 * Lets users toggle ambient winter breeze sound & change snowfall intensity
 */
export const SnowAudioPill: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [density, setDensity] = useState<'gentle' | 'normal' | 'blizzard'>('normal');
  const [showControls, setShowControls] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopSnowAudio();
    };
  }, []);

  const startSnowAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Generate pink/white noise buffer for soft alpine wind gusts
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low-pass filter for soft howling winter wind
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);
      filter.Q.setValueAtTime(3.2, ctx.currentTime);

      // Low-frequency oscillator to create natural gentle wind gusts
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.18, ctx.currentTime); // slow wind modulation
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(220, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Main Gain
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 1.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(0);
      lfo.start(0);

      noiseNodeRef.current = whiteNoise;
      gainNodeRef.current = gain;
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const stopSnowAudio = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtxRef.current.currentTime + 0.8
        );
        setTimeout(() => {
          if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
            audioCtxRef.current.close();
          }
          audioCtxRef.current = null;
        }, 850);
      } catch {
        // ignore
      }
    }
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopSnowAudio();
    } else {
      startSnowAudio();
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1 z-20">
      <div className="inline-flex items-center rounded-full bg-sky-100/90 dark:bg-sky-950/80 backdrop-blur-md border border-sky-300/80 dark:border-sky-700/80 shadow-xs px-3 py-1 text-xs text-sky-900 dark:text-sky-100 font-medium">
        <span className="flex items-center gap-1.5 font-semibold">
          <Snowflake className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Snowfall Active</span>
        </span>

        <span className="mx-2 w-px h-3 bg-sky-300 dark:bg-sky-700" />

        <button
          onClick={toggleAudio}
          className="flex items-center gap-1 text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white transition-colors cursor-pointer"
          title={isPlaying ? 'Mute Alpine Wind Audio' : 'Play Alpine Wind Audio'}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
              <span className="text-[11px] font-semibold">Alpine Wind On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 opacity-60" />
              <span className="text-[11px] opacity-75 hover:opacity-100">Wind Audio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
