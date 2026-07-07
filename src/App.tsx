
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Particles from '@tsparticles/react';
import { tsParticles } from '@tsparticles/engine';
import { loadAll } from '@tsparticles/all';
import { Swiper, SwiperSlide } from 'swiper/react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { 
  Gift, Lock, Unlock, ArrowDown, Sparkles, Crown, Volume2, VolumeX, Clock
} from 'lucide-react';
import backgroundMusic from './assets/We Are Electric - Flying Steps - Lyrics.mp3';
import bgImg from './assets/Background.webp';
import game1Img from './assets/1.jfif';
import game2Img from './assets/2.png';
import game3Img from './assets/3.jpg';
import game4Img from './assets/4.jpg';
import game5Img from './assets/5.jpg';

// --- COMPONENT 1: FULLSCREEN CYBER HEXAGON MATRIX BACKGROUND ---
function HexagonBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-15 pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Tessellating hex pattern grid */}
          <pattern id="hex-pattern" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
            <path 
              d="M28 0 L56 16.16 L56 48.5 L28 64.66 L0 48.5 L0 16.16 Z" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="0.8" 
              className="animate-pulse" 
              style={{ animationDuration: '5s' }} 
            />
            <path 
              d="M28 48.5 L56 64.66 L56 97 L28 113.16 L0 97 L0 64.66 Z" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="0.8" 
              className="animate-pulse" 
              style={{ animationDuration: '7s', animationDelay: '1.5s' }} 
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-pattern)" />
      </svg>
    </div>
  );
}

// --- COMPONENT 2: BIOMETRIC FLOATING PROFILE LOGO (1:1 PORTRAIT) ---
function FloatingLogo() {
  return (
    <div className="relative w-44 h-44 mx-auto select-none pointer-events-none animate-logo-float z-10 my-4 flex items-center justify-center">
      {/* Dynamic Cyber scanning rings */}
      <div 
        className="absolute inset-0 rounded-full border border-red-500/40 animate-spin" 
        style={{ animationDuration: '14s' }} 
      />
      <div 
        className="absolute inset-2.5 rounded-full border border-dashed border-red-600/30 animate-spin" 
        style={{ animationDuration: '9s', animationDirection: 'reverse' }} 
      />
      
      {/* High-End Hologram Glow Backplane */}
      <div className="absolute inset-6 bg-red-600/10 rounded-full blur-xl animate-pulse" />

      {/* Main biometric target photo - Standardized to aspect-square */}
      <img 
        src={nekoskiImg} 
        alt="Nekoski Biometric Profile" 
        className="w-32 h-32 object-cover aspect-square rounded-full border border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.4)] bg-zinc-950 relative z-10"
      />
    </div>
  );
}

import { messages } from './mockData';
import nekoskiImg from './assets/nekoski.webp';

// Swiper styles
import 'swiper/css';
import 'yet-another-react-lightbox/styles.css';

// Pre-defined mockup memory gallery images for the Swiper showcase
const GALLERY_PHOTOS = [
  nekoskiImg,
  game1Img,
  game2Img,
  game3Img,
  game4Img,
  game5Img
];

// Sound interface placeholder for premium UI sound design
class SoundManager {
  private static muted: boolean = true;
  static toggleMute() { this.muted = !this.muted; return this.muted; }
  static isMuted() { return this.muted; }
  static play(type: 'hover' | 'click' | 'success' | 'fail' | 'vault' | 'laser') {
    if (this.muted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.stop(audioCtx.currentTime + 0.4);
      } else if (type === 'fail') {
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'laser') {
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'vault') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
        osc.stop(audioCtx.currentTime + 0.8);
      } else {
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.stop(audioCtx.currentTime + 0.05);
      }
    } catch (e) {
      // Audio context block prevention fallback
    }
  }
}

// --- GAME 1: PREMIUM DRAG-LESS SPRINGY JIGSAW (3x3 EDITION) ---
function Game1Jigsaw({ onSolve }: { onSolve: () => void }) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    // Generate 9 tiles (3x3 grid)
    const initial = Array.from({ length: 9 }, (_, i) => i);
    // Secure shuffle
    for (let i = initial.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initial[i], initial[j]] = [initial[j], initial[i]];
    }
    setTiles(initial);
  }, []);

  const handleTileClick = (index: number) => {
    if (solved) return;
    SoundManager.play('click');
    
    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      const newTiles = [...tiles];
      // Springy Swap transition
      const temp = newTiles[selectedIdx];
      newTiles[selectedIdx] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedIdx(null);

      // Verify grid alignment
      if (newTiles.every((val, i) => val === i)) {
        setSolved(true);
        SoundManager.play('success');

        confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
  
        setTimeout(onSolve, 1200);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-red-500 to-zinc-400">TRIAL I: THE IMAGE RESTORATION</h2>
        <p className="text-sm text-zinc-400 mt-2">Click a piece, then select another to slide them into alignment.</p>
      </div>

      {/* Grid changed to grid-cols-3 grid-rows-3 to support the 3x3 layout */}
      <div className="w-70 h-70 grid grid-cols-3 grid-rows-3 gap-0.5 bg-zinc-950 border border-zinc-800 p-1.5 rounded-lg relative overflow-hidden premium-glow-red shadow-2xl">
        {tiles.map((val, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = val === idx;
          return (
            <motion.div
              key={val} // Keyed to value to enable Framer-Motion layout mechanics
              layout
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              onClick={() => handleTileClick(idx)}
              className={`w-[88px] h-[88px] cursor-pointer relative border transition-all ${
                isSelected ? 'border-red-500 scale-105 z-10 shadow-[0_0_15px_rgba(220,38,38,0.6)]' : 'border-transparent hover:border-zinc-700/50'
              }`}
              style={{
                backgroundImage: `url(${game1Img})`, // Render unique Game 1 Jigsaw Image
                backgroundSize: '264px 264px',
                backgroundPosition: `-${(val % 3) * 88}px -${Math.floor(val / 3) * 88}px`, // Adjusted coordinate mapping for 3x3 tiles
              }}
            >
              {isCorrect && !solved && (
                <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.9)]" />
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {solved && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
            <div className="premium-glass px-6 py-3 rounded text-zinc-200 text-lg flex items-center gap-2">
              🏆 First Seal Broken: <span className="text-red-500 font-black text-2xl ml-2">B</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- GAME 2: MEMORY CARD MATCH ---
function Game2Memory({ onSolve }: { onSolve: () => void }) {
  const emojis = ['🎂', '🎈', '🎁', '🎉', '🍕', '🍰'];
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shaking, setShaking] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  const handleFlip = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx) || solved) return;
    SoundManager.play('click');

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        SoundManager.play('success');
        setCombo(c => c + 1);
        setMatched(prev => {
          const next = [...prev, newFlipped[0], newFlipped[1]];
          if (next.length === cards.length) {
            setSolved(true);

            confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
            setTimeout(onSolve, 1200);
          }
          return next;
        });
        setFlipped([]);
      } else {
        SoundManager.play('fail');
        setCombo(0);
        setShaking(newFlipped);
        setTimeout(() => {
          setShaking([]);
          setFlipped([]);
        }, 600);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-red-500 to-zinc-400">TRIAL II: COGNITIVE MATRIX</h2>
        <div className="flex justify-center gap-4 text-xs text-zinc-400 uppercase tracking-widest mt-2">
          <span>Moves: <strong className="text-white">{moves}</strong></span>
          <span>Combo: <strong className="text-red-500">{combo}x</strong></span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
        {/* Dynamic Holographic Blueprint HUD showing 2.png */}
        <div className="hidden md:flex w-62 h-52 premium-glass p-2 rounded-lg flex-col items-center justify-between shrink-0">
          <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Salamat sa gabay at pagturo mo po sa amin!</p>
          <img src={game2Img} alt="Matrix Key Reference" className="w-full h-34 object-cover rounded border border-zinc-800 opacity-60 hover:opacity-100 transition-opacity" />
          <span className="text-[7px] text-red-500 animate-pulse">MATRIX_STABLE</span>
        </div>

        {/* Cognitive Deck Grid */}
        <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
          {cards.map((emoji, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            const isShaking = shaking.includes(idx);
            return (
              <motion.div 
                key={idx} 
                onClick={() => handleFlip(idx)}
                className="w-16 h-24 cursor-pointer perspective-1000"
                animate={isShaking ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                whileHover={{ y: -4 }}
              >
                <div className={`w-full h-full transition-transform duration-500 preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
                  <div className="absolute inset-0 backface-hidden bg-zinc-950 border border-zinc-800 rounded shadow-md hover:border-red-600 transition-colors" />
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-linear-to-br from-red-900 to-zinc-950 border border-red-500 rounded flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                    {emoji}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {solved && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="premium-glass px-6 py-3 rounded text-zinc-200 text-lg flex items-center gap-2">
              🧠 Memory Expert unlocked: <span className="text-red-500 font-black text-2xl ml-2">I</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- GAME 3: RIDDLE CHALLENGE (CONVERSATIONAL ASSISTANT - EXPANSED EDITION) ---
function Game3Riddles({ onSolve }: { onSolve: () => void }) {
  const riddles = [
    { q: "I get taller every birthday but never grow. What am I?", a: ["candle", "candles", "age"] },
    { q: "I can be wrapped but I'm not clothing.", a: ["gift", "present"] },
    { q: "I have layers and sweet frosting.", a: ["cake"] },
    { q: "You blow on me to make a wish.", a: ["candle", "candles"] },
    { q: "I fly without wings and pop without warning.", a: ["balloon", "balloons"] }
  ];

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [solved, setSolved] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("Greetings, Agent. I am G.A.B.-9000. Decrypt my security questions.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isThinking) return;
    setIsThinking(true);
    SoundManager.play('click');

    setTimeout(() => {
      const isCorrect = riddles[index].a.some(ans => input.toLowerCase().includes(ans));
      setIsThinking(false);
      
      if (isCorrect) {
        SoundManager.play('success');
        setInput("");
        if (index + 1 === riddles.length) {
          setSolved(true);
          setAssistantMessage("Ayoko sa Xampp, okay pa yung Wamp. Nice.");
          setTimeout(onSolve, 1200);
        } else {
          setIndex(index + 1);
          setAssistantMessage(`Affirmative! Prepare for core protocol ${index + 2}.`);
        }
      } else {
        SoundManager.play('fail');
        setAssistantMessage("Incorrect key value. Try analyzing the query from another angle.");
      }
    }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg px-4">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-red-500 to-zinc-400">TRIAL III: DECIPHER ALGORITHM</h2>
      </div>

      {/* Scaled-up G.A.B.-9000 Character UI */}
      <div className="w-full premium-glass p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center sm:items-start shadow-2xl border-red-500/30">
        <div className="relative shrink-0 select-none">
          {/* Hologram boundary expanded to w-36 h-36 for high-visibility */}
          <div className="w-36 h-36 rounded-xl bg-red-950/80 border-2 border-red-500 overflow-hidden relative shadow-[0_0_25px_rgba(239,68,68,0.5)]">
            <img src={game3Img} alt="GAB Holographic visualizer" className="w-full h-full object-cover opacity-85 scale-105" />
          </div>
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-green-500 rounded-full animate-ping" />
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-950" />
        </div>
        
        <div className="flex-1 space-y-2 text-center sm:text-left w-full">
          <p className="text-xs sm:text-sm text-zinc-400 uppercase tracking-widest font-black flex items-center justify-center sm:justify-start gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
            G.A.B.-9000 CORE PROTOCOL
          </p>
          {/* Increased typography and comfortable leading */}
          <div className="text-base sm:text-lg text-zinc-150 leading-relaxed font-mono font-medium">
            {assistantMessage}
          </div>
        </div>
      </div>

      {!solved && (
        <form onSubmit={handleSubmit} className="w-full bg-zinc-950 border border-zinc-800 p-6 rounded-xl relative shadow-xl">
          {/* Realistic server nodes decorative graphic */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-800" />
            <span className="w-2 h-2 rounded-full bg-zinc-800" />
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          </div>
          <p className="text-lg text-zinc-300 mb-6 font-mono text-center font-semibold">"{riddles[index].q}"</p>
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isThinking}
            className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-red-500 p-4 text-center text-xl text-white outline-none transition-all rounded-lg uppercase tracking-wide"
            placeholder={isThinking ? "COMPUTING SECURITY SIGNAL..." : "Type decryption string..."}
          />
          <button type="submit" disabled={isThinking} className="w-full mt-4 bg-zinc-800 hover:bg-red-700 hover:text-white font-bold py-3.5 rounded-lg transition-colors uppercase text-sm tracking-widest cursor-pointer">
            {isThinking ? "SOLVING ALGORITHM..." : "SUBMIT DECRYPT VALUE"}
          </button>
        </form>
      )}

      <AnimatePresence>
        {solved && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
            <div className="premium-glass px-8 py-4 rounded-xl text-zinc-200 text-lg flex items-center justify-center gap-3">
              🔍 Riddle Master unlocked: <span className="text-red-500 font-black text-2xl ml-2">R</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- COMPONENT VECTOR RELICS (NO EMOJIS, FLAT PREMIUM VECTOR ICONS) ---
const SVGBalloon = () => (
  <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a6 6 0 0 1 6 6c0 4-3 8-6 8s-6-4-6-8a6 6 0 0 1 6-6z" />
    <path d="M12 16v4M10 21h4" />
  </svg>
);

const SVGGift = () => (
  <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M12 3v18M3 8h18M12 8c-2-3-5-2-5 0s3 2 5 0c2-3 5-2 5 0s-3 2-5 0z" />
  </svg>
);

const SVGCake = () => (
  <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 19h20M2 19l4-8h12l4 8M6 11l6-6 6 6M12 5V2" />
  </svg>
);

const SVGHat = () => (
  <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L4 18h16L12 2z" />
    <path d="M8 10h8M6 14h12" />
    <circle cx="12" cy="2" r="1" fill="#a855f7" />
  </svg>
);

const SVGCandle = () => (
  <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="8" width="6" height="12" rx="1" />
    <path d="M12 8V5M12 5c-1-1-1-3 0-3s1 2 0 3z" />
  </svg>
);

const SVGCrystal = () => (
  <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L5 9l7 13 7-7-7-13zM5 9h14M12 2v20" />
  </svg>
);

// Pre-defined relative coordinate locations for randomised playthroughs
const DESK_ARCHIVE_PRESETS = [
  {
    balloon: { left: '18%', top: '22%', hint: "helium density spikes registered on the far left server frame" },
    gift: { left: '74%', top: '68%', hint: "electromagnetic load high adjacent to the right storage console" },
    cake: { left: '44%', top: '48%', hint: "sugar carbohydrate readings active directly near the center table console" },
    hat: { left: '82%', top: '18%', hint: "conical reflection registered near upper right ceiling duct" },
    candle: { left: '31%', top: '74%', hint: "combustion radiation detected in lower primary grid terminal" },
    crystal: { left: '56%', top: '16%', hint: "crystalline visual diffraction found above central holographic display" }
  },
  {
    balloon: { left: '78%', top: '24%', hint: "floating structure logs located on the upper right server ceiling" },
    gift: { left: '16%', top: '70%', hint: "metal lock container reading active on the lower left floor generator" },
    cake: { id: 'cake', icon: '🍰', name: 'Cake Piece', pos: 'bottom-[42%] right-[18%]' },
    cake_pos: { left: '54%', top: '50%', hint: "sweet organic matter traces on the main control desk surface" },
    hat: { left: '34%', top: '16%', hint: "triangular geometric waves emitting from upper left structural rafters" },
    candle: { left: '68%', top: '44%', hint: "minor localized heat fluctuations right beside the server bay" },
    crystal: { left: '42%', top: '78%', hint: "energy refraction crystal signature located low below structural conduits" }
  }
];

// --- GAME 4: REDESIGNED CYBER SCAVENGER DECRYPT ---
function Game4HiddenObject({ onSolve }: { onSolve: () => void }) {
  const [found, setFound] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [activePreset, setActivePreset] = useState<any>(null);
  const [scannerPos, setScannerPos] = useState({ x: 120, y: 120 });
  const [, setLastFoundTimer] = useState(0);
  const [aiMessage, setAiMessage] = useState("V-AI: Scanner calibrated. Locate the 6 encrypted relics inside this archive.");
  
  // Decrypt/Hold timer states
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize random playthrough layout
  useEffect(() => {
    const randomPreset = DESK_ARCHIVE_PRESETS[Math.floor(Math.random() * DESK_ARCHIVE_PRESETS.length)];
    setActivePreset(randomPreset);
  }, []);

  // AI Prompt Hint System Trigger (Runs every 1s)
  useEffect(() => {
    if (solved || !activePreset) return;
    const interval = setInterval(() => {
      setLastFoundTimer((t) => {
        const next = t + 1;
        if (next === 25) {
          // Identify first unfound object to recommend hint for
          const missing = Object.keys(activePreset).find(key => !found.includes(key));
          if (missing && activePreset[missing]) {
            setAiMessage(`V-AI: ${activePreset[missing].hint.toUpperCase()}`);
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [found, solved, activePreset]);

  // Stable, functional handleFind callback to prevent timer reset issues
  const handleFind = useCallback((id: string) => {
    setFound((prevFound) => {
      if (prevFound.includes(id)) return prevFound;
      
      SoundManager.play('laser');
      const newFound = [...prevFound, id];
      setLastFoundTimer(0); // Reset hint timer
      setAiMessage(`V-AI: CORE DECRYPT SUCCESSFUL. RELIC [${id.toUpperCase()}] SECURED.`);

      if (newFound.length === 6) {
        setSolved(true);
        SoundManager.play('success');

        confetti({
    particleCount: 200,
    spread: 120,
    origin: { y: 0.6 }
  });

        setTimeout(onSolve, 1400);
      }
      return newFound;
    });
  }, [onSolve]);

  const objects = useMemo(() => {
    if (!activePreset) return [];
    return [
      { id: 'balloon', icon: <SVGBalloon />, name: 'Balloon', loc: activePreset.balloon },
      { id: 'gift', icon: <SVGGift />, name: 'Gift Box', loc: activePreset.gift },
      { id: 'cake', icon: <SVGCake />, name: 'Cake Piece', loc: activePreset.cake_pos || activePreset.cake },
      { id: 'hat', icon: <SVGHat />, name: 'Party Hat', loc: activePreset.hat },
      { id: 'candle', icon: <SVGCandle />, name: 'Candle', loc: activePreset.candle },
      { id: 'crystal', icon: <SVGCrystal />, name: 'Crystal Spark', loc: activePreset.crystal }
    ];
  }, [activePreset]);

  // Generic coordinate updates for both Mouse and Touch inputs
  const updateScannerFromCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setScannerPos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateScannerFromCoords(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateScannerFromCoords(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateScannerFromCoords(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Proximity evaluation hook to set active scanningId
  useEffect(() => {
    if (!activePreset || solved || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    let currentScannedId: string | null = null;

    for (const obj of objects) {
      if (found.includes(obj.id)) continue;
      const objLeftPct = parseFloat(obj.loc?.left || '0');
      const objTopPct = parseFloat(obj.loc?.top || '0');
      const realLeft = (objLeftPct / 100) * width;
      const realTop = (objTopPct / 100) * height;

      const distance = Math.hypot(scannerPos.x - realLeft, scannerPos.y - realTop);
      if (distance < 65) {
        currentScannedId = obj.id;
        break;
      }
    }

    if (currentScannedId !== scanningId) {
      setScanningId(currentScannedId);
      setScanProgress(0);
    }
  }, [scannerPos, found, activePreset, solved, objects, scanningId]);

  // Automated "Hold Hover to Collect" progress tick
  useEffect(() => {
    if (!scanningId || solved) {
      setScanProgress(0);
      return;
    }

    const intervalTime = 30; // ms per tick
    const totalDuration = 700; // Total hold duration required (700ms)
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          handleFind(scanningId);
          return 0;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [scanningId, solved, handleFind]);

  if (!activePreset) return null;

  // Calculate parallax offsets based on scans
  const normX = containerRef.current ? (scannerPos.x / containerRef.current.clientWidth) - 0.5 : 0;
  const normY = containerRef.current ? (scannerPos.y / containerRef.current.clientHeight) - 0.5 : 0;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-5xl px-4 select-none">
      
      {/* --- SIDEBAR MISSION SYSTEM TERMINAL (HUD) --- */}
      <div className="w-full lg:w-80 premium-glass p-5 rounded-xl border border-zinc-800 flex flex-col gap-4 relative shrink-0">
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 animate-ping" />
        <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-800 pb-2">Diagnostic Console HUD</h3>
        
        {/* Metric rows */}
        <div className="space-y-1.5 font-mono text-[10px] text-zinc-400">
          <div className="flex justify-between"><span>SCANNER ENERGY:</span><span className="text-white font-bold">100.0%</span></div>
          <div className="flex justify-between"><span>SEALS LOCKED:</span><span className="text-red-500 font-bold">5/5</span></div>
          <div className="flex justify-between"><span>RECOVERED SENSORS:</span><span className="text-green-500 font-bold">{found.length} / 6</span></div>
          <div className="flex justify-between"><span>VAULT FREQUENCY:</span><span className="text-zinc-300">5.82 GHz</span></div>
        </div>

        {/* AI System Dialog Textbox */}
        <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded text-[11px] font-mono text-zinc-300 leading-normal min-h-16">
          {aiMessage}
        </div>

        {/* Dynamic target checkpoints */}
        <div className="space-y-2 border-t border-zinc-800 pt-3">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Matrix Targets</p>
          {objects.map((obj) => {
            const isFound = found.includes(obj.id);
            return (
              <div 
                key={obj.id} 
                className={`flex items-center gap-3 text-xs transition-colors duration-200 ${isFound ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${isFound ? 'border-green-600 bg-green-950/20' : 'border-zinc-700'}`}>
                  {isFound && <span className="w-1.5 h-1.5 bg-green-500 rounded-sm" />}
                </div>
                <span>{obj.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- THE INTERACTIVE SPECTRAL ROOM (EXPLORER GRID) --- */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="text-center lg:text-left w-full">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-red-500 to-zinc-400">TRIAL IV: SPECTRAL RECUPERATION</h2>
          <p className="text-sm text-zinc-400 mt-2">Drag or hover your searchlight over cloaked energy traces to bypass shields.</p>
        </div>

        {/* Active room view (Added touch-none and touch listeners) */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[320px] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden cursor-crosshair shadow-2xl premium-glow-red touch-none"
        >
          {/* Cyber Volumetric Searchlight Radial Mask Effect */}
          <div 
            className="absolute inset-0 pointer-events-none z-30 transition-all duration-75 mix-blend-multiply"
            style={{
              background: `radial-gradient(circle 90px at ${scannerPos.x}px ${scannerPos.y}px, rgba(255,255,255,1) 0%, rgba(9,9,11,0.96) 100%)`
            }}
          />

          {/* 1. BACKGROUND ENVIRONMENT LAYER (Parallax speed: Slow) */}
          <div 
            className="absolute inset-0 z-0 opacity-40 transition-transform duration-300 ease-out flex items-center justify-between px-10"
            style={{ transform: `translate3d(${normX * 8}px, ${normY * 8}px, 0)` }}
          >
            {/* Left Server Rack with display console */}
            <div className="w-40 h-60 bg-zinc-900/60 border border-zinc-800 rounded flex flex-col gap-1 p-2 relative overflow-hidden shrink-0">
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase mb-1">Ikaw ba ito Sir Gab?</span>
              <img src={game4Img} alt="Console Stream" className="w-full h-16 object-cover rounded opacity-40 hover:opacity-100 transition-opacity" />
              <span className="w-full h-1 bg-red-950 rounded animate-pulse mt-1" />
              <span className="w-2/3 h-1 bg-zinc-800 rounded" />
            </div>

            {/* Right Server rack */}
            <div className="w-28 h-40 bg-zinc-900/60 border border-zinc-800 rounded flex flex-col gap-3 p-3 shrink-0">
              <span className="w-1/2 h-2 bg-zinc-800 rounded" />
              <span className="w-full h-1 bg-red-950 rounded" />
              <span className="w-full h-1.5 bg-zinc-800 rounded" />
            </div>
          </div>

          {/* 2. MIDDLE GROUND ENVIRONMENT LAYER (Parallax speed: Medium) */}
          <div 
            className="absolute inset-0 z-10 transition-transform duration-300 ease-out"
            style={{ transform: `translate3d(${normX * 16}px, ${normY * 16}px, 0)` }}
          >
            {/* Desktop Table Surface console */}
            <div className="absolute bottom-0 left-[20%] right-[20%] h-24 bg-zinc-900/80 border-t-2 border-red-900/50 rounded-t-lg flex items-center justify-around px-6">
              <div className="w-14 h-10 bg-zinc-950 border border-zinc-800 rounded flex flex-col items-center justify-center">
                <span className="text-[7px] text-red-500 animate-pulse font-mono">SIGNAL_SYS</span>
              </div>
              <div className="w-20 h-3 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-red-600 animate-pulse" />
              </div>
            </div>
          </div>

          {/* 3. SENSORS / HIDDEN RECOVERY TARGETS */}
          <div className="absolute inset-0 z-20">
            {objects.map((obj) => {
              const isFound = found.includes(obj.id);
              const isScanning = scanningId === obj.id;
              
              const objLeftPct = parseFloat(obj.loc?.left || '0');
              const objTopPct = parseFloat(obj.loc?.top || '0');

              return (
                <div
                  key={obj.id}
                  style={{
                    position: 'absolute',
                    left: `${objLeftPct}%`,
                    top: `${objTopPct}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="transition-all duration-300 select-none"
                >
                  <button
                    onClick={() => handleFind(obj.id)}
                    className={`relative p-3 rounded-full border-2 transition-all duration-300 ${
                      isFound 
                        ? 'scale-150 opacity-0 pointer-events-none' 
                        : isScanning 
                          ? 'border-red-500 bg-red-950/40 shadow-[0_0_20px_rgba(220,38,38,0.8)] scale-110' 
                          : 'border-transparent bg-transparent scale-100 opacity-20'
                    }`}
                  >
                    {/* Retro Cyber target reticle lock overlay when scanned */}
                    {isScanning && (
                      <>
                        <div className="absolute -inset-2.5 border border-dashed border-red-500 rounded-full animate-spin" style={{ animationDuration: '4s' }} />
                        {/* Circular Progress Decryptor Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 scale-125 pointer-events-none">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="42%"
                            stroke="#ef4444"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray="100"
                            strokeDashoffset={100 - scanProgress}
                            strokeLinecap="round"
                            className="transition-all duration-75"
                          />
                        </svg>
                      </>
                    )}
                    {obj.icon}
                  </button>
                </div>
              );
            })}
          </div>

          {/* 4. FOREGROUND ASSETS LAYER (Parallax speed: Fast) */}
          <div 
            className="absolute inset-0 z-40 pointer-events-none transition-transform duration-300 ease-out"
            style={{ transform: `translate3d(${normX * 28}px, ${normY * 28}px, 0)` }}
          >
            {/* Hanging server rack wires and edge conduits */}
            <div className="absolute top-0 left-10 w-2.5 h-36 bg-linear-to-b from-zinc-800 to-transparent opacity-60" />
            <div className="absolute top-0 right-16 w-1 h-44 bg-linear-to-b from-zinc-800 to-transparent opacity-60" />
            <div className="absolute bottom-4 left-6 w-12 h-12 bg-red-950/20 border border-red-900/30 rounded-full blur-xs" />
          </div>

        </div>
      </div>

      {/* --- FINALE DECRYPT MODAL COVER --- */}
      <AnimatePresence>
        {solved && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center w-full lg:absolute lg:bottom-12 lg:left-1/2 lg:-translate-x-1/2 lg:z-50"
          >
            <div className="premium-glass px-8 py-4 rounded text-zinc-200 text-lg flex items-center justify-center gap-3">
              🛡️ Spectral Locator loaded: <span className="text-red-500 font-black text-2xl ml-2">T</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- GAME 5: CYBER-VAULT CODE LOCK ---
function Game5CodeLock({ onSolve }: { onSolve: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [solved, setSolved] = useState(false);
  const [gearsRotating, setGearsRotating] = useState(false);

  const leftGearRef = useRef<SVGSVGElement>(null);
  const rightGearRef = useRef<SVGSVGElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    SoundManager.play('click');
    const clean = code.trim().toUpperCase();

    if (clean === "BIRTHDAY" || clean === "BIRTH") {
      setSolved(true);
      setGearsRotating(true);
      SoundManager.play('vault');

      confetti({
    particleCount: 300,
    spread: 150,
    origin: { y: 1.0 }
  });

      // GSAP gear lock pneumatic spin animation
      gsap.to([leftGearRef.current, rightGearRef.current], {
        rotation: "+=720",
        transformOrigin: "center center",
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
          setGearsRotating(false);
          setTimeout(onSolve, 500);
        }
      });
    } else {
      SoundManager.play('fail');
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-red-500 to-zinc-400">TRIAL V: CORE COMPILATION</h2>
        <p className="text-sm text-zinc-400 mt-2">Synthesize sequence: <span className="text-red-500 font-bold tracking-widest ml-1">B I R T</span></p>
      </div>

      <div className="relative w-full flex justify-between px-6 mb-2 items-center">
        {/* Left Hydraulic Gear */}
        <svg ref={leftGearRef} className="w-12 h-12 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>

        {/* Main decrypt image display (5.jpg) */}
        <div className="w-75 h-75 premium-glass p-1.5 rounded-lg flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden">
          <img src={game5Img} alt="Encrypted Core Visualizer" className="w-full h-full object-cover rounded shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
        </div>

        {/* Right Hydraulic Gear */}
        <svg ref={rightGearRef} className="w-12 h-12 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </div>

      <form onSubmit={handleSubmit} className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-lg relative">
        <p className="text-center text-xs text-zinc-500 uppercase tracking-widest mb-4">Today is a wondrous day! And Today is your...</p>
        
        <input 
          type="text" 
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className={`w-full bg-zinc-950 border-b-2 p-3 text-center text-2xl font-bold tracking-widest text-red-500 outline-none transition-colors uppercase ${error ? 'border-red-600 bg-red-950/20' : 'border-zinc-700 focus:border-red-500'}`}
          placeholder="Ano na?"
          disabled={solved || gearsRotating}
        />

        <button 
          type="submit" 
          disabled={solved || gearsRotating}
          className="w-full mt-6 bg-linear-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-3.5 rounded transition-all text-xs tracking-widest uppercase"
        >
          {gearsRotating ? "EXTRACTING PLATES..." : solved ? "ACCESS GRANTED" : "FINAL ANSWER"}
        </button>
      </form>
    </div>
  );
}

// --- MAIN APPLICATION CORE ---
export default function App() {
const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize background track on mount
  useEffect(() => {
    const audio = new Audio(backgroundMusic);
    audio.loop = true;
    audio.volume = 0.35; // Sets comfortable gaming atmosphere level
    audio.muted = soundMuted;
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  const [booting, setBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootProgress, setBootProgress] = useState(0);
  const [soundMuted, setSoundMuted] = useState(true);

  const [progress, setProgress] = useState(0); 
  const [openedCards, setOpenedCards] = useState<Record<string, boolean>>({});
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState("");

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  // --- PREMIUM RETRO BINARY RAIN COMPONENT ---
function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const yPositions = Array(columns).fill(0);

    let animationFrameId: number;

    const draw = () => {
      // Subtle trail fade-out
      ctx.fillStyle = 'rgba(9, 9, 11, 0.08)'; // matches zinc-950
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ef4444'; // Theme red
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < yPositions.length; i++) {
        const char = Math.random() > 0.5 ? '1' : '0';
        const x = i * fontSize;
        const y = yPositions[i];

        // Random transparent layers for depth
        ctx.globalAlpha = Math.random() * 0.12 + 0.03;
        ctx.fillText(char, x, y);

        // Reset column or increment downward
        if (y > 100 + Math.random() * 10000) {
          yPositions[i] = 0;
        } else {
          yPositions[i] += fontSize;
        }
      }
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-80" />;
}

  useEffect(() => {
    if (!booting) return;
    const lines = [
      "INITIALIZING NEKOSKI CELEBRATION PROTOCOL v2.0.26...",
      "TUNNELING TO CENTRAL DATA MATRIX PORT...",
      "DECRYPTING SECURED VAULT SYMMETRY CORE...",
      "AUTHENTICATING RESIDENT BIOMETRICS...",
      "G.A.B.-9000 ONLINE. SECURE SHUTTLE READY.",
      "SYSTEM INITIATED. PRESS SKIP OR PREPARE MISSION START."
    ];

    let lineIdx = 0;
    const lineTimer = setInterval(() => {
      if (lineIdx < lines.length) {
        // 1. Capture the correct line synchronously
        const currentLine = lines[lineIdx];
        
        // 2. Safely push the captured string
        setBootLines(prev => [...prev, currentLine]);
        
        // 3. Increment the progress bar smoothly to 100%
        setBootProgress(p => {
          if (lineIdx === lines.length - 1) return 100;
          return Math.min(p + 17, 100);
        });

        lineIdx++;
      } else {
        clearInterval(lineTimer);
      }
    }, 400);

    return () => clearInterval(lineTimer);
  }, [booting]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Premium clock updates every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

const [particlesReady, setParticlesReady] = useState(false);

useEffect(() => {
  loadAll(tsParticles).then(() => {
    setParticlesReady(true);
  });
}, []);

  // Sync cursor spring logic
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && cursorDotRef.current) {
        gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.25, ease: "power2.out" });
        gsap.to(cursorDotRef.current, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Autoscroll logic on completion state shifts
  // Autoscroll logic and Vault Confetti loop execution on completion
  useEffect(() => {
    if (progress > 0 && sectionRefs.current[progress]) {
      setTimeout(() => {
        sectionRefs.current[progress]?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
    
    // Looping celebratory explosion sequence upon unlocking Stage 6
    if (progress === 6) {
      const duration = 3.5 * 1000;
      const end = Date.now() + duration;
      const colors = ['#ef4444', '#dc2626', '#ffffff', '#71717a'];

      (function frame() {
        // Left side launcher
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.75 },
          colors: colors,
          zIndex: 1000
        });
        // Right side launcher
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.75 },
          colors: colors,
          zIndex: 1000
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [progress]);

const handleSkipBoot = () => {
    SoundManager.play('success');
    setBooting(false);

    // Unmute system automatically on skip since user initiated action
    setSoundMuted(false);
    if (SoundManager.isMuted()) {
      SoundManager.toggleMute();
    }

    // Play track safely (Click gesture unlocks browser autoplay constraints)
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch((err) => {
        console.warn("Audio initiation blocked by sandbox policy:", err);
      });
    }
  };

  const [isTransitioning, setIsTransitioning] = useState(false);

const handleReadyClick = () => {
  setIsTransitioning(true);
  
  // Wait for the sweeping color bands to slide across the screen before skipping the boot
  setTimeout(() => {
    handleSkipBoot();
  }, 1000); 
};

  const toggleSound = () => {
    const isMuted = SoundManager.toggleMute();
    setSoundMuted(isMuted);
    
    // Dynamically sync backing track with the global HUD controls
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      // Safeguard in case user toggles sound before track started
      if (!isMuted && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  };
  const unlockNext = (level: number) => {
    if (progress < level) {
      setProgress(level);
    }
  };

  const toggleCard = (id: string) => {
    SoundManager.play('click');
    setOpenedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderSection = (level: number, Content: React.ReactNode) => {
    const isUnlocked = progress >= level;
    
    return (
      <section 
        ref={(el) => { sectionRefs.current[level] = el; }}
        className="min-h-screen w-full flex flex-col items-center justify-center relative border-b border-zinc-900/30 py-16 px-4 snap-start shrink-0"
      >
        {!isUnlocked ? (
          <div className="flex flex-col items-center text-zinc-800 gap-4 opacity-40 select-none">
            <Lock size={48} />
            <h2 className="text-xl font-bold tracking-widest">SECURE CHANNEL CLOSED</h2>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center justify-center relative"
          >
            {Content}
            {level < 6 && (
              <div className="absolute -bottom-12 flex flex-col items-center text-red-600 animate-bounce cursor-pointer"
                   onClick={() => sectionRefs.current[level + 1]?.scrollIntoView({ behavior: 'smooth' })}>
                <Unlock size={18} className="mb-1" />
                <ArrowDown size={20} />
              </div>
            )}
          </motion.div>
        )}
      </section>
    );
  };

return (
    <main 
      className={`h-screen w-full relative selection:bg-red-600 ${
        booting 
          ? 'overflow-hidden' 
          : 'overflow-y-auto snap-y snap-mandatory scroll-smooth crt-overlay'
      }`}
    >
      
      {/* Cinematic Particle Background */}
      {particlesReady && (
        <Particles
          id="tsparticles"
          className="absolute inset-0 pointer-events-none z-0 opacity-40"
          options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                resize: { enable: true }
              },
              modes: {
                repulse: { distance: 100, duration: 0.4 }
              }
            },
            particles: {
              color: { value: "#ef4444" },
              links: { color: "#ef4444", distance: 150, enable: true, opacity: 0.15, width: 1 },
              move: { enable: true, speed: 1.2, direction: "none" },
              number: { value: 60, density: { enable: true } },
              opacity: { value: 0.25 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } }
            },
            detectRetina: true
          }}
        />
      )}

       <BinaryRain />

      {/* Premium Magnetic Cursor System */}
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={cursorDotRef} className="custom-cursor-dot hidden md:block" />

      {/* Floating Clock & Sound controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <div className="premium-glass px-4 py-2 rounded-lg text-xs font-bold text-red-500 border border-red-500/30 flex items-center gap-2">
          <Clock size={12} className="animate-spin-slow" />
          <span>{currentTime || "ESTABLISHING CHRONOLOGY..."}</span>
        </div>
        <button 
          onClick={toggleSound}
          className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

     {/* --- SCENE 0: CRT TERMINAL BOOT --- */}
<AnimatePresence>
  {booting && (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-zinc-950 z-50 flex flex-col p-6 font-mono justify-between text-xs text-green-500 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Ambient Hexagonal Grid tessellator */}
      <HexagonBackground />

      {/* Dark grid contrast overlay to secure console legibility */}
      <div className="absolute inset-0 bg-black/85 z-0 pointer-events-none" />

      {/* Sliding Color Panels Transition Overlay */}
{isTransitioning && (
  <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
    {/* Panel 1: Cyber Red (Slides in from left and stays) */}
    <motion.div 
      initial={{ x: "-102%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="absolute inset-y-0 left-0 w-[102%] bg-red-600"
    />
    {/* Panel 2: Neutral Gray (Slides in from right and stays) */}
    <motion.div 
      initial={{ x: "102%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
      className="absolute inset-y-0 right-0 w-[102%] bg-zinc-600"
    />
    {/* Panel 3: Dark Charcoal Gray (Slides in from left and stays) */}
    <motion.div 
      initial={{ x: "-102%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 }}
      className="absolute inset-y-0 left-0 w-[102%] bg-zinc-900"
    />
  </div>
)}

      <div className="space-y-4 relative z-10 flex-1 flex flex-col justify-center">
        <p className="text-zinc-500 text-center uppercase tracking-widest text-[9px] mb-4">Biometric console initialized // Exalted user access</p>
        
        {/* Central Floating biometric target profile */}
        <FloatingLogo />

        <div className="space-y-1 max-w-lg mx-auto text-left w-full border-t border-zinc-900/50 pt-4">
          {bootLines.map((line, idx) => (
            <p key={idx} className="animate-in fade-in duration-300">{`> ${line}`}</p>
          ))}
          <span className="inline-block w-2.5 h-4 bg-green-500 animate-pulse ml-1" />
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4 relative z-10 mx-auto lg:mx-0">
        <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden">
          <div className="bg-green-600 h-full transition-all duration-300" style={{ width: `${bootProgress}%` }} />
        </div>
        <div className="flex justify-between items-center text-zinc-500 min-h-12">
          <span>STAGE LOADING {bootProgress}%</span>
          
          <AnimatePresence>
            {bootProgress === 100 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleReadyClick}
                className="px-5 py-2 border border-red-500 bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-black hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all rounded font-bold uppercase cursor-pointer tracking-wider text-xs animate-pulse"
              >
                Ready Now!
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

      {/* --- STAGE 0: INTRODUCTION AND AMBIENT MATRIX HEADER --- */}
      <section ref={(el) => { sectionRefs.current[0] = el; }} className="min-h-screen w-full flex flex-col items-center justify-center relative text-center px-6 snap-start shrink-0 border-b border-zinc-900/30 py-20">
        
        {/* Floating Matrix Cyber Rain in 10% opacity */}
        <div className="absolute inset-0 bg-zinc-950/40 pointer-events-none overflow-hidden select-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%)] bg-size-[100%_4px]" />
        </div>

        <Crown className="w-20 h-20 text-red-600 mb-6 drop-shadow-[0_0_25px_rgba(220,38,38,0.7)] animate-bounce z-10" />
        <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-b from-gray-200 to-gray-500 mb-4 z-10 select-none">
          HAPPY BIRTHDAY, <span className="text-red-500">NEKOSKI</span>!
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold text-red-600 tracking-widest mb-8 z-10 select-none">
          TO CELEBRATE YOUR SPECIAL DAY
        </h2>
        <p className="text-zinc-400 max-w-xl text-sm leading-relaxed z-10">
An exclusive journey awaits you. Hidden behind each trial is a piece of something special, but only those who solve every challenge will uncover the final surprise. Trust your instincts, think creatively, and enjoy the adventure. Are you ready to begin? (IT Tayo eh.)
        </p>
        
        {progress === 0 && (
          <button 
            onClick={() => { SoundManager.play('success'); unlockNext(1); }}
            className="mt-12 px-10 py-4 bg-zinc-950 border border-red-900 text-red-500 font-bold tracking-widest hover:bg-red-950 hover:text-white transition-all shadow-[0_0_20px_rgba(220,38,38,0.25)] z-10 uppercase text-xs cursor-pointer"
          >
            Begin the Quest
          </button>
        )}

        {progress > 0 && (
          <div className="absolute bottom-10 flex flex-col items-center text-red-600 animate-bounce">
            <ArrowDown size={28} />
          </div>
        )}
      </section>

      {/* SEQUENTIAL SECURITY CHANNELS */}
      {progress >= 1 && renderSection(1, <Game1Jigsaw onSolve={() => unlockNext(2)} />)}
      {progress >= 2 && renderSection(2, <Game2Memory onSolve={() => unlockNext(3)} />)}
      {progress >= 3 && renderSection(3, <Game3Riddles onSolve={() => unlockNext(4)} />)}
      {progress >= 4 && renderSection(4, <Game4HiddenObject onSolve={() => unlockNext(5)} />)}
      {progress >= 5 && renderSection(5, <Game5CodeLock onSolve={() => unlockNext(6)} />)}

      {/* --- FINAL SECTOR: THE UNLOCKED VAULT & PREMIUM GIFTS --- */}
      {progress >= 6 && (
        <section ref={(el) => { sectionRefs.current[6] = el; }} className="min-h-screen w-full snap-start shrink-0 py-24 px-6 flex flex-col items-center relative bg-radial-gradient from-zinc-900 to-zinc-950 border-t border-red-900/30">
          <Sparkles className="text-red-500 w-16 h-16 mb-6 animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-black text-gray-200 mb-4 tracking-widest uppercase text-center drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            SEALS DISSOLVED
          </h1>
          <p className="text-zinc-400 mb-16 text-center max-w-2xl text-sm leading-relaxed">
            All protocols are fully resolved. You have unlocked access to your secure cards.
          </p>

          {/* Premium Swiper Memory Slideshow Component (Locked to aspect-square) */}
<div className="w-full max-w-sm aspect-square mb-12 relative mx-auto">
  <div className="absolute -inset-2 bg-red-600/10 rounded-xl blur-lg pointer-events-none" />
  <Swiper
    spaceBetween={20}
    slidesPerView={1}
    loop={true}
    onTap={(swiper) => {
      SoundManager.play('click');
      
      // 1. Check if Swiper captured the exact slide that was clicked
      if (swiper.clickedSlide) {
        const slideIndexAttr = swiper.clickedSlide.getAttribute('data-swiper-slide-index');
        if (slideIndexAttr !== null) {
          const realClickedIndex = parseInt(slideIndexAttr, 10);
          setLightboxIndex(realClickedIndex); // Opens the exact tapped slide
          return;
        }
      }
      
      // 2. Fallback to active index if target element is not resolved
      setLightboxIndex(swiper.realIndex);
    }}
    className="rounded-xl overflow-hidden border border-zinc-800 w-full h-full aspect-square"
  >
    {GALLERY_PHOTOS.map((src, idx) => (
      <SwiperSlide key={idx} className="cursor-pointer">
        <img 
          src={src} 
          alt="Nekoski Memory Grid" 
          className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500" 
        />
      </SwiperSlide>
    ))}
  </Swiper>
  <p className="text-center text-zinc-500 text-xs mt-3 uppercase tracking-widest">Click photo above to expand gallery</p>
</div>

          {/* Dynamic Lightbox for Zoom / Fullscreen experience */}
          <Lightbox
  index={lightboxIndex}
  open={lightboxIndex >= 0}
  close={() => setLightboxIndex(-1)}
  slides={GALLERY_PHOTOS.map(p => ({ src: p }))}
  plugins={[Zoom]}
  on={{
    view: ({ index }) => {
      setLightboxIndex(index); // Syncs state dynamically when swiping inside the lightbox
    }
  }}
/>

          {/* Custom Flippable Birthday Gift Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto perspective-1000">
            {messages.map((msg) => {
              const isOpen = openedCards[msg.id];
              return (
                <div key={msg.id} className="h-64 w-full cursor-pointer group" onClick={() => toggleCard(msg.id)}>
                  <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isOpen ? 'rotate-y-180' : ''}`}>
                    
                    {/* Front View */}
                    <div className="absolute inset-0 backface-hidden bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center shadow-2xl group-hover:border-red-900 transition-colors">
                      <div className="w-16 h-16 bg-red-950/60 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                        <Gift className="text-red-500" size={28} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-200 uppercase tracking-widest">{msg.sender}</h2>
                      <span className="text-xs text-red-500 uppercase tracking-widest mt-1">GIFT CARD</span>
                    </div>

                    {/* Back View (Reveals actual message) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-linear-to-br from-red-900 to-zinc-950 border border-red-700 rounded-xl p-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-1">{msg.sender}</h3>
                      <span className="text-xs text-red-400 uppercase tracking-widest block mb-4 border-b border-red-800/40 pb-2">{msg.relation}</span>
                      <p className="text-zinc-200 text-sm leading-relaxed overflow-y-auto pr-2 flex-1 font-mono">
                        "{msg.text}"
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </main>
  );
}