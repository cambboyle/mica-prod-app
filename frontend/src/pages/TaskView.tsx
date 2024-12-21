import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';
import { Task, TaskStatus, TaskPriority } from '../types/task.types';
import './TaskView.css';

interface ValidationErrors {
  [key: string]: string;
}

const TaskView: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    if (!taskId) {
      setError('No task ID provided');
      setLoading(false);
      return;
    }

    try {
      const fetchedTask = await taskService.getTask(taskId);
      setTask(fetchedTask);
      setEditedTask(fetchedTask);
    } catch (err) {
      setError('Failed to fetch task');
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors = taskService.validateTask(editedTask);
    const errorMap: ValidationErrors = {};
    errors.forEach(error => {
      if (error.toLowerCase().includes('title')) {
        errorMap.title = error;
      } else if (error.toLowerCase().includes('priority')) {
        errorMap.priority = error;
      } else if (error.toLowerCase().includes('due date')) {
        errorMap.dueDate = error;
      } else if (error.toLowerCase().includes('description')) {
        errorMap.description = error;
      }
    });
    
    setValidationErrors(errorMap);
    return Object.keys(errorMap).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setValidationErrors({});
  };

  const handleCancel = () => {
    if (Object.keys(validationErrors).length > 0 || 
        JSON.stringify(editedTask) !== JSON.stringify(task)) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        setIsEditing(false);
        setEditedTask(task || {});
        setValidationErrors({});
      }
    } else {
      setIsEditing(false);
      setEditedTask(task || {});
    }
  };

  const handleSave = async () => {
    if (!taskId || !editedTask.title) return;

    if (!validateForm()) {
      return;
    }

    try {
      const updatedTask = await taskService.updateTask(taskId, editedTask);
      setTask(updatedTask);
      setIsEditing(false);
      setError(null);
      setValidationErrors({});
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update task');
      }
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!taskId) return;

    try {
      await taskService.deleteTask(taskId);
      navigate('/tasks');
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleToggleStatus = async () => {
    setShowStatusConfirm(true);
  };

  const confirmStatusChange = async () => {
    if (!taskId) return;

    try {
      const updatedTask = await taskService.toggleTaskStatus(taskId);
      setTask(updatedTask);
      setError(null);
    } catch (err) {
      setError('Failed to update task status');
      console.error('Error updating task status:', err);
    } finally {
      setShowStatusConfirm(false);
    }
  };

  const handleInputChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
    // Clear validation error for the field being edited
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (loading) {
    return <div className="task-view-loading">Loading...</div>;
  }

  if (error || !task) {
    return (
      <div className="task-view-error">
        <p>{error || 'Task not found'}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="task-view">
      <div className="task-view-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="task-status-badge" data-status={task.status}>
          {task.status}
        </div>
      </div>

      <div className="task-view-content">
        {isEditing ? (
          <div className="task-edit-form">
            <div className="form-group">
              <input
                type="text"
                value={editedTask.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`task-title-input ${validationErrors.title ? 'error' : ''}`}
                placeholder="Task title"
              />
              {validationErrors.title && (
                <div className="error-message">{validationErrors.title}</div>
              )}
            </div>
            
            <div className="metadata-section">
              <div className="metadata-item">
                <label>Status</label>
                <select
                  value={editedTask.status}
                  onChange={(e) => handleInputChange('status', e.target.value as TaskStatus)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="metadata-item">
                <label>Priority</label>
                <select
                  value={editedTask.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
                  className={validationErrors.priority ? 'error' : ''}
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {validationErrors.priority && (
                  <div className="error-message">{validationErrors.priority}</div>
                )}
              </div>
              <div className="metadata-item">
                <label>Category</label>
                <input
                  type="text"
                  value={editedTask.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
              </div>
              <div className="metadata-item">
                <label>Tags</label>
                <input
                  type="text"
                  value={editedTask.tags?.join(', ') || ''}
                  onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                />
              </div>
              <div className="metadata-item">
                <label>Due Date</label>
                <input
                  type="date"
                  value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={validationErrors.dueDate ? 'error' : ''}
                />
                {validationErrors.dueDate && (
                  <div className="error-message">{validationErrors.dueDate}</div>
                )}
              </div>
            </div>

            <div className="task-description">
              <label>Description</label>
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Task description"
                rows={4}
                className={validationErrors.description ? 'error' : ''}
              />
              {validationErrors.description && (
                <div className="error-message">{validationErrors.description}</div>
              )}
            </div>

            <div className="task-actions">
              <button className="action-button save" onClick={handleSave}>
                Save Changes
              </button>
              <button className="action-button cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1>{task.title}</h1>
            
            <div className="metadata-section">
              <div className="metadata-item">
                <span className="label">Status</span>
                <span className="value" data-status={task.status}>
                  {task.status}
                </span>
              </div>
              <div className="metadata-item">
                <span className="label">Priority</span>
                <span className="value" data-priority={task.priority}>
                  {task.priority}
                </span>
              </div>
              <div className="metadata-item">
                <span className="label">Category</span>
                <span className="value">
                  {task.category}
                </span>
              </div>
              {task.tags && task.tags.length > 0 && (
                <div className="metadata-item">
                  <span className="label">Tags</span>
                  <div className="tags-list">
                    {task.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="metadata-item">
                <span className="label">Created</span>
                <span className="value">
                  {new Date(task.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="metadata-item">
                <span className="label">Last Updated</span>
                <span className="value">
                  {new Date(task.updatedAt).toLocaleString()}
                </span>
              </div>
              {task.dueDate && (
                <div className="metadata-item">
                  <span className="label">Due Date</span>
                  <span className="value">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="task-description">
              <h2>Description</h2>
              <p>{task.description || 'No description provided'}</p>
            </div>

            <div className="task-actions">
              <button className="action-button edit" onClick={handleEdit}>
                Edit Task
              </button>
              <button 
                className={`action-button status ${task.status === 'completed' ? 'completed' : ''}`}
                onClick={handleToggleStatus}
              >
                {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button className="action-button delete" onClick={handleDelete}>
                Delete Task
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Dialogs */}
      {showDeleteConfirm && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <h2>Delete Task</h2>
            <p>Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="action-button delete" onClick={confirmDelete}>
                Delete
              </button>
              <button className="action-button cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showStatusConfirm && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <h2>Change Status</h2>
            <p>
              Are you sure you want to mark this task as {task.status === 'completed' ? 'incomplete' : 'complete'}?
            </p>
            <div className="dialog-actions">
              <button className="action-button status" onClick={confirmStatusChange}>
                Confirm
              </button>
              <button className="action-button cancel" onClick={() => setShowStatusConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskView;
