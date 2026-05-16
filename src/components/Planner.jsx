import React, { useState } from 'react';
import { Plus, ChevronDown, CheckCircle, Circle, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Planner = () => {
  const [subjects, setSubjects] = useState([]);

  const [expandedSubject, setExpandedSubject] = useState(1);

  const toggleModule = (subjectId, moduleId) => {
    setSubjects(subjects.map(sub => {
      if (sub.id === subjectId) {
        const updatedModules = sub.modules.map(mod => 
          mod.id === moduleId ? { ...mod, completed: !mod.completed } : mod
        );
        const completedCount = updatedModules.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedModules.length) * 100);
        return { ...sub, modules: updatedModules, progress };
      }
      return sub;
    }));
  };

  const addSubject = () => {
    const name = window.prompt("Enter new subject name:");
    if (name) {
      const newSubject = {
        id: Date.now(),
        name,
        color: 'var(--text-primary)',
        progress: 0,
        modules: []
      };
      setSubjects([...subjects, newSubject]);
    }
  };

  const editSubject = (id, currentName) => {
    const name = window.prompt("Edit subject name:", currentName);
    if (name) {
      setSubjects(subjects.map(s => s.id === id ? { ...s, name } : s));
    }
  };

  const deleteSubject = (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      setSubjects(subjects.filter(s => s.id !== id));
      if (expandedSubject === id) setExpandedSubject(null);
    }
  };

  const addModule = (subjectId) => {
    const title = window.prompt("Enter new module title:");
    if (title) {
      setSubjects(subjects.map(sub => {
        if (sub.id === subjectId) {
          const newModules = [...sub.modules, { id: Date.now(), title, completed: false }];
          const completedCount = newModules.filter(m => m.completed).length;
          const progress = Math.round((completedCount / newModules.length) * 100);
          return { ...sub, modules: newModules, progress };
        }
        return sub;
      }));
    }
  };

  const deleteModule = (subjectId, moduleId) => {
    if (window.confirm("Delete this module?")) {
      setSubjects(subjects.map(sub => {
        if (sub.id === subjectId) {
          const newModules = sub.modules.filter(m => m.id !== moduleId);
          const progress = newModules.length > 0 ? Math.round((newModules.filter(m => m.completed).length / newModules.length) * 100) : 0;
          return { ...sub, modules: newModules, progress };
        }
        return sub;
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Subject Planner</h2>
          <p>Organize and track your coursework</p>
        </div>
        <button className="btn btn-primary" onClick={addSubject}>
          <Plus size={18} />
          Add Subject
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {subjects.map(subject => (
          <div key={subject.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div 
              style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', cursor: 'pointer', background: expandedSubject === subject.id ? 'rgba(255,255,255,0.02)' : 'transparent' }}
              onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
            >
              <div style={{ width: '4px', height: '40px', background: subject.color, borderRadius: '4px', marginRight: '1.5rem' }}></div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{subject.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="progress-container" style={{ width: '200px', margin: 0 }}>
                    <div className="progress-fill" style={{ width: `${subject.progress}%`, background: subject.color }}></div>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{subject.progress}% Complete</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="btn-icon-only" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); editSubject(subject.id, subject.name); }}>
                  <Edit2 size={18} />
                </button>
                <button className="btn-icon-only" style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.8 }} onClick={(e) => { e.stopPropagation(); deleteSubject(subject.id); }}>
                  <Trash2 size={18} />
                </button>
                <div style={{ width: '1px', height: '20px', background: 'var(--card-border)', margin: '0 0.5rem' }}></div>
                <ChevronDown 
                  size={20} 
                  style={{ transform: expandedSubject === subject.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} 
                />
              </div>
            </div>

            <AnimatePresence>
              {expandedSubject === subject.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ borderTop: '1px solid var(--card-border)', background: 'var(--bg-secondary)', overflow: 'hidden' }}
                >
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1rem' }}>Modules</h4>
                      <button className="btn-icon-only" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => addModule(subject.id)}>
                        <Plus size={16} /> Add Module
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {subject.modules.map(module => (
                        <div 
                          key={module.id} 
                          style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--card-border)' }}
                        >
                          <button 
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: module.completed ? 'var(--success)' : 'var(--text-secondary)', marginRight: '1rem', display: 'flex' }}
                            onClick={() => toggleModule(subject.id, module.id)}
                          >
                            {module.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                          </button>
                          <span style={{ flex: 1, textDecoration: module.completed ? 'line-through' : 'none', color: module.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                            {module.title}
                          </span>
                          <button className="btn-icon-only" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => deleteModule(subject.id, module.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner;
