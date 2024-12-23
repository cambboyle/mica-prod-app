import React, { useState, useEffect } from 'react';
import { Todo, TodoStatus } from '../types/todo.types';
import './TodoModal.css';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todo: Partial<Todo>) => void;
}

const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const todoData: Partial<Todo> = {
      title: title.trim(),
      status: TodoStatus.PENDING,
    };

    onSubmit(todoData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Todo</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="submit" className="submit-button">
              Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;
