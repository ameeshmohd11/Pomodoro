import React, { useState } from 'react';
import { Plus, Check, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({ title: '', deadline: '', priority: 'medium' });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({ title: '', deadline: '', priority: 'medium' });
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'No deadline';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2>Task Management</h2>
        <p>Keep track of your assignments and deadlines</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleAddTask} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto', gap: '1rem', alignItems: 'end' }}>
          <div className="input-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Task Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="What needs to be done?" 
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Deadline</label>
            <input 
              type="datetime-local" 
              className="input" 
              value={newTask.deadline}
              onChange={e => setNewTask({...newTask, deadline: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Priority</label>
            <select 
              className="input" 
              value={newTask.priority}
              onChange={e => setNewTask({...newTask, priority: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
              <Plus size={20} />
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.sort((a, b) => a.completed - b.completed).map(task => (
           <div 
            key={task.id} 
            className="glass-card" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
              opacity: task.completed ? 0.7 : 1, transition: 'all 0.3s'
            }}
          >
            <button 
              onClick={() => toggleTask(task.id)}
              style={{
                width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${task.completed ? 'var(--success)' : 'var(--text-secondary)'}`,
                background: task.completed ? 'var(--success)' : 'transparent', color: 'var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {task.completed && <Check size={14} />}
            </button>
            <div style={{ flex: 1 }}>
              <h4 style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {task.title}
              </h4>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {formatDateTime(task.deadline)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`badge badge-${task.priority}`}>{task.priority}</span>
              <button 
                onClick={() => deleteTask(task.id)}
                className="btn-icon-only" 
                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <Check size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>No tasks found. Add a new task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
