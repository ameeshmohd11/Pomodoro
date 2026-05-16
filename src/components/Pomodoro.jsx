import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const Pomodoro = () => {
  const [mode, setMode] = useState('focus'); // focus, break
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      if (mode === 'focus') {
        setSessions(s => s + 1);
        setMode('break');
        setTimeLeft(5 * 60);
        // Play notification sound
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(e => console.log(e));
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(e => console.log(e));
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Pomodoro Timer</h2>
        <p>Boost your productivity with focused sessions</p>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background based on mode */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, zIndex: 0,
          background: 'radial-gradient(circle, var(--text-primary) 0%, transparent 70%)'
        }} />

        <div style={{ zIndex: 1, display: 'flex', gap: '1rem', marginBottom: '3rem', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '2rem', border: '1px solid var(--card-border)' }}>
          <button 
            onClick={() => switchMode('focus')}
            style={{ 
              padding: '0.5rem 1.5rem', borderRadius: '1.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: mode === 'focus' ? 'var(--text-primary)' : 'transparent',
              color: mode === 'focus' ? 'var(--bg-primary)' : 'var(--text-secondary)', fontWeight: 600, transition: 'all 0.3s'
            }}
          >
            <BrainCircuit size={18} /> Focus
          </button>
          <button 
             onClick={() => switchMode('break')}
             style={{ 
              padding: '0.5rem 1.5rem', borderRadius: '1.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: mode === 'break' ? 'var(--text-secondary)' : 'transparent',
              color: mode === 'break' ? 'var(--bg-primary)' : 'var(--text-secondary)', fontWeight: 600, transition: 'all 0.3s'
            }}
          >
            <Coffee size={18} /> Break
          </button>
        </div>

        <div style={{ zIndex: 1, position: 'relative', width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* SVG Circular Progress */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="125" cy="125" r="110" fill="transparent" stroke="var(--card-border)" strokeWidth="8" />
            <motion.circle 
              cx="125" cy="125" r="110" fill="transparent" 
              stroke={mode === 'focus' ? 'var(--text-primary)' : 'var(--text-secondary)'} 
              strokeWidth="8" strokeDasharray="691" 
              strokeDashoffset={691 - (progress / 100) * 691}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
              strokeLinecap="round"
            />
          </svg>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '-2px' }}>
            {formatTime(timeLeft)}
          </h1>
        </div>

        <div style={{ zIndex: 1, display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
          <button 
            onClick={toggleTimer}
            style={{ 
              width: '64px', height: '64px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'var(--text-primary)', color: 'var(--bg-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isActive ? <Pause size={28} style={{ fill: 'currentColor' }} /> : <Play size={28} style={{ fill: 'currentColor', marginLeft: '4px' }} />}
          </button>
          
          <button 
            onClick={resetTimer}
            className="glass-card"
            style={{ 
              width: '64px', height: '64px', borderRadius: '50%', border: '1px solid var(--card-border)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'
            }}
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Completed Sessions today: <strong style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>{sessions}</strong></p>
      </div>
    </div>
  );
};

export default Pomodoro;
