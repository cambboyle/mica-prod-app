import React, { useState, useEffect } from 'react';
import './TaskModal.css';
import { Task } from '../services/taskService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'status'>) => void;
  initialData?: Task;
  mode: 'add' | 'edit';
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
    } else if (isOpen) {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
    setError(null);
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const taskData: Omit<Task, 'id' | 'status'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    onSubmit(taskData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Add New Task' : 'Edit Task'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {mode === 'add' ? 'Add Task' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
