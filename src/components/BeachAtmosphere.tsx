import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Waves, Sun, Sparkles } from 'lucide-react';

interface BeachAtmosphereProps {
  primaryColor?: string;
  secondaryColor?: string;
  showAudioToggle?: boolean;
}

export const BeachAtmosphere: React.FC<BeachAtmosphereProps> = ({
  primaryColor = '#0284c7',
  secondaryColor = '#0d9488',
  showAudioToggle = true,
}) => {
  return (
    <>
      <BeachBackgroundEffects primaryColor={primaryColor} secondaryColor={secondaryColor} />
      {showAudioToggle && <BeachAudioPill />}
    </>
  );
};

export const BeachBackgroundEffects: React.FC<{
  primaryColor?: string;
  secondaryColor?: string;
}> = ({
  primaryColor = '#0284c7',
  secondaryColor = '#0d9488',
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Gentle Floating Sunlit Sea Sparkles */}
      <div className="absolute top-10 left-[18%] w-2 h-2 rounded-full bg-amber-300/50 blur-[0.5px] animate-pulse" style={{ animationDuration: '3.5s' }} />
      <div className="absolute top-28 right-[24%] w-1.5 h-1.5 rounded-full bg-cyan-300/60 blur-[0.5px] animate-ping" style={{ animationDuration: '5.5s' }} />
      <div className="absolute top-[45%] left-[10%] w-2.5 h-2.5 rounded-full bg-teal-300/35 blur-[1px] animate-pulse" style={{ animationDuration: '4.8s' }} />
      <div className="absolute top-[35%] right-[15%] w-2 h-2 rounded-full bg-amber-400/40 blur-[0.5px] animate-pulse" style={{ animationDuration: '4.2s' }} />
      <div className="absolute bottom-20 left-[38%] w-2 h-2 rounded-full bg-sky-300/50 blur-[0.5px] animate-ping" style={{ animationDuration: '6.5s' }} />
      <div className="absolute top-16 right-[40%] w-1.5 h-1.5 rounded-full bg-amber-200/60 blur-[0.5px] animate-pulse" style={{ animationDuration: '3s' }} />

      {/* Gentle Ambient Coastal Water Ripples (Layered SVG Waves at bottom) */}
      <div className="absolute -bottom-1 left-0 right-0 h-16 sm:h-24 w-full overflow-hidden opacity-30">
        <svg
          className="absolute bottom-0 w-[200%] h-full animate-[waveFlow_16s_ease-in-out_infinite_alternate]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0,45 C150,85 350,10 500,45 C650,80 850,20 1000,50 C1150,80 1200,45 1200,45 L1200,120 L0,120 Z"
            fill={primaryColor}
            fillOpacity="0.18"
          />
        </svg>
        <svg
          className="absolute -bottom-1 w-[200%] h-full animate-[waveFlow_22s_ease-in-out_infinite_alternate-reverse]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0,60 C200,20 380,85 580,45 C780,10 950,75 1200,35 L1200,120 L0,120 Z"
            fill={secondaryColor}
            fillOpacity="0.15"
          />
        </svg>
      </div>
    </div>
  );
};

export const BeachAudioPill: React.FC = () => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      stopSurfAudio();
    };
  }, []);

  const startSurfAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Create pink noise buffer (2 seconds loop) for ocean surf
      const bufferSize = ctx.sampleRate * 2;
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
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // gentle level
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter simulating ocean wave swell
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      // Low frequency oscillator for wave ebb and flow (~7.5 second rhythmic swell)
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.13, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(360, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Master volume gain node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 1.5);
      gainNodeRef.current = masterGain;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      whiteNoise.start();
      lfo.start();
      setIsPlayingAudio(true);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const stopSurfAudio = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        setTimeout(() => {
          if (ctx.state !== 'closed') {
            ctx.close().catch(() => {});
          }
          audioCtxRef.current = null;
          gainNodeRef.current = null;
        }, 650);
      } catch {
        audioCtxRef.current = null;
        gainNodeRef.current = null;
      }
    }
    setIsPlayingAudio(false);
  };

  const toggleSurfAudio = () => {
    if (isPlayingAudio) {
      stopSurfAudio();
    } else {
      startSurfAudio();
    }
  };

  return (
    <button
      onClick={toggleSurfAudio}
      type="button"
      aria-label={isPlayingAudio ? 'Mute ocean waves sound' : 'Play relaxing ocean waves sound'}
      title={isPlayingAudio ? 'Click to mute ocean waves' : 'Click for gentle beach waves ambient sound'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-300 border shadow-xs cursor-pointer active:scale-95 ${
        isPlayingAudio
          ? 'bg-sky-100/90 text-sky-900 border-sky-300 ring-2 ring-sky-400/30'
          : 'bg-white/80 hover:bg-white text-sky-800 border-sky-200/90 hover:border-sky-300'
      }`}
    >
      {isPlayingAudio ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
          <span className="flex items-center gap-1">
            <span>Ocean Waves</span>
            <span className="flex gap-0.5 ml-0.5">
              <span className="w-1 h-2 bg-sky-500 rounded-full animate-pulse" />
              <span className="w-1 h-3 bg-sky-500 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-1.5 bg-sky-500 rounded-full animate-pulse delay-150" />
            </span>
          </span>
        </>
      ) : (
        <>
          <Waves className="w-3.5 h-3.5 text-sky-600" />
          <span>Ocean Sound</span>
        </>
      )}
    </button>
  );
};
