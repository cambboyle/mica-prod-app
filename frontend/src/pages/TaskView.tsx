import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService, { Task } from '../services/taskService';
import './TaskView.css';

const TaskView: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setError('No task ID provided');
        setLoading(false);
        return;
      }

      try {
        const fetchedTask = await taskService.getTask(taskId);
        setTask(fetchedTask);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch task');
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

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
        <h1>{task.title}</h1>
        
        <div className="task-metadata">
          <div className="metadata-item">
            <span className="label">Due Date</span>
            <span className="value">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
            </span>
          </div>
          <div className="metadata-item">
            <span className="label">Priority</span>
            <span className="value priority-badge" data-priority={task.priority}>
              {task.priority}
            </span>
          </div>
          {task.projectId && (
            <div className="metadata-item">
              <span className="label">Project ID</span>
              <span className="value">{task.projectId}</span>
            </div>
          )}
        </div>

        <div className="task-description">
          <h2>Description</h2>
          <p>{task.description || 'No description provided'}</p>
        </div>

        <div className="task-actions">
          <button 
            className="action-button edit"
            onClick={() => {/* TODO: Implement edit functionality */}}
          >
            Edit Task
          </button>
          <button 
            className={`action-button status ${task.status === 'completed' ? 'completed' : ''}`}
            onClick={() => {/* TODO: Implement status toggle */}}
          >
            {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskView;
