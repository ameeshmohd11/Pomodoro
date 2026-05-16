import React, { useState } from 'react';
import { Book, Clock, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateStudyPlan } from '../ai.js';

const Dashboard = ({ setCurrentPage }) => {
  const stats = [
    { title: 'Study Time (Week)', value: '0 hrs', icon: Clock },
    { title: 'Tasks Completed', value: '0', icon: Target },
    { title: 'Current Streak', value: '0 Days', icon: TrendingUp },
  ];

  const upcomingTasks = [];
  const todaySchedule = [];

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiPrompt) return;
    setIsAiLoading(true);

    const response = await generateStudyPlan(aiPrompt);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ padding: '1rem', borderRadius: '1rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              <stat.icon size={28} />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{stat.title}</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        {/* Main Section */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Today's Schedule</h3>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setCurrentPage?.('timetable')}>View Full Timetable</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {todaySchedule.length > 0 ? todaySchedule.map((session, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--card-border)' }}>
                <div style={{ padding: '0.75rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', borderRadius: '0.75rem', border: '1px solid var(--card-border)' }}>
                  <Book size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{session.subject}</h4>
                  <p style={{ fontSize: '0.85rem' }}>{session.time} • {session.type}</p>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${session.progress}%` }}></div>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <p>No classes scheduled for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              <AlertCircle size={20} />
              <h4 style={{ fontWeight: '600' }}>AI Planner Bot</h4>
            </div>
            
            {!aiResponse ? (
              <form onSubmit={handleAiSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>Ready to study? Ask me to generate a schedule for your upcoming exams.</p>
                <input 
                  type="text" 
                  value={aiPrompt} 
                  onChange={(e) => setAiPrompt(e.target.value)} 
                  placeholder="e.g. Create a plan for my Math exam on Friday..."
                  className="input"
                  style={{ fontSize: '0.85rem', padding: '0.75rem' }}
                  disabled={isAiLoading}
                />
                <button type="submit" disabled={isAiLoading || !aiPrompt} className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem', padding: '0.6rem' }}>
                  {isAiLoading ? 'Analyzing...' : 'Generate Plan'}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.85rem', lineHeight: '1.6', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--card-border)' }}>
                  <p>{aiResponse}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ flex: 2, fontSize: '0.85rem', padding: '0.6rem' }} onClick={() => setCurrentPage?.('timer')}>
                    Start Pomodoro
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem' }} onClick={() => {setAiResponse(null); setAiPrompt('');}}>
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Tasks */}
          <div className="glass-card" style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '1rem' }}>Upcoming Tasks</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                <div key={task.id} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h5 style={{ fontWeight: '500', fontSize: '0.95rem', flex: 1 }}>{task.title}</h5>
                    <span className={`badge badge-${task.priority}`} style={{ fontSize: '0.65rem' }}>{task.priority}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {task.deadline}
                  </p>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>
                  <p style={{ fontSize: '0.9rem' }}>No upcoming tasks.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
