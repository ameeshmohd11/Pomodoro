import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, ArrowDown } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

const Timetable = () => {
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ name: '', date: '' });

  const handleAddExam = (e) => {
    e.preventDefault();
    if (!newExam.name || !newExam.date) return;
    setExams([...exams, { id: Date.now(), name: newExam.name, date: newExam.date }]);
    setNewExam({ name: '', date: '' });
  };

  const deleteExam = (id) => {
    setExams(exams.filter(exam => exam.id !== id));
  };

  const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  const today = new Date();
  today.setHours(0,0,0,0); // reset time to accurately compare days

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2>Exam Timetable</h2>
        <p>Track exactly how many days you have left for exams, and the layout between them</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleAddExam} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) auto', gap: '1rem', alignItems: 'end' }}>
          <div className="input-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Exam Name / Subject</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Physics Midterm" 
              value={newExam.name}
              onChange={e => setNewExam({...newExam, name: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Exam Date</label>
            <input 
              type="date" 
              className="input" 
              value={newExam.date}
              onChange={e => setNewExam({...newExam, date: e.target.value})}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
              <Plus size={20} /> Add
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {sortedExams.map((exam, idx) => {
          const examDate = new Date(exam.date);
          examDate.setHours(23,59,59,999);
          const daysLeft = differenceInDays(examDate, today);
          let prevExamDate = null;
          let gapDays = null;
          
          if (idx > 0) {
            prevExamDate = new Date(sortedExams[idx - 1].date);
            prevExamDate.setHours(23,59,59,999);
            gapDays = differenceInDays(examDate, prevExamDate);
          }

          return (
            <React.Fragment key={exam.id}>
              {gapDays !== null && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0', opacity: 0.8 }}>
                   <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '0.25rem 1rem', borderRadius: '1rem', border: '1px solid var(--card-border)' }}>
                     <ArrowDown size={14} /> {gapDays} days gap bettween exam <ArrowDown size={14} />
                   </div>
                </div>
              )}
              
              <div
                className="glass-card" 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', 
                  borderLeft: '4px solid var(--text-primary)'
                }}
              >
                <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '1rem', color: 'var(--text-primary)' }}>
                  <Calendar size={28} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '0.25rem' }}>{exam.name}</h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <Clock size={16} /> {format(examDate, 'PPPP')}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                    {daysLeft < 0 ? 'Passed' : daysLeft === 0 ? 'Today' : `${daysLeft} Days`}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {daysLeft > 0 ? 'left for exam' : ''}
                  </p>
                </div>
                
                <button 
                  onClick={() => deleteExam(exam.id)}
                  className="btn-icon-only" 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', opacity: 0.7, paddingLeft: '1rem' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </React.Fragment>
          );
        })}
        
        {sortedExams.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <Calendar size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>No exams added yet. Track your dates and study gaps here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;
