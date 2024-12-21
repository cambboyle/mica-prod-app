import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tasks.css';
import TaskModal from '../components/TaskModal';
import taskService from '../services/taskService';
import { Task, TaskSearchParams, TaskStatus, TaskPriority, TaskCategory } from '../types/task.types';
import { useTasks } from '../hooks/useTasks';

type SortField = 'priority' | 'dueDate' | 'status';
type SortOrder = 'asc' | 'desc';

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    searchTasks
  } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [activeFilters, setActiveFilters] = useState<{
    status: TaskStatus[];
    priority: TaskPriority[];
    category: TaskCategory[];
    tags: string[];
  }>({
    status: [],
    priority: [],
    category: [],
    tags: []
  });

  type FilterValue = TaskStatus | TaskPriority | TaskCategory | string;

  useEffect(() => {
    fetchTasks({});
  }, []);

  useEffect(() => {
    // Initialize filteredTasks with all tasks when component mounts
    if (!tasks) {
      setFilteredTasks([]);
      return;
    }

    const filtered = tasks.filter(task => {
      // Apply search term filter
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm.trim() || [
        task.title,
        task.description,
        task.category,
        ...(task.tags || [])
      ].some(field => field?.toLowerCase().includes(searchTermLower));

      // Apply status filter
      const matchesStatus = activeFilters.status.length === 0 || 
        activeFilters.status.includes(task.status);

      // Apply priority filter
      const matchesPriority = activeFilters.priority.length === 0 || 
        activeFilters.priority.includes(task.priority);

      // Apply category filter
      const matchesCategory = activeFilters.category.length === 0 || 
        activeFilters.category.includes(task.category);

      // Apply tags filter
      const matchesTags = activeFilters.tags.length === 0 || 
        activeFilters.tags.some(tag => task.tags?.includes(tag));

      return matchesSearch && matchesStatus && matchesPriority && 
             matchesCategory && matchesTags;
    });

    setFilteredTasks(filtered);
  }, [searchTerm, tasks, activeFilters]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortedTasks = () => {
    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'priority':
          const priorityOrder = { low: 0, medium: 1, high: 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'status':
          const statusOrder = { pending: 0, 'in-progress': 1, completed: 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await createTask(taskData);
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      await updateTask(taskId, taskData);
      setShowModal(false);
      setSelectedTask(null);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleFilterChange = (
    filterType: keyof typeof activeFilters,
    value: FilterValue
  ) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterType] as FilterValue[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  const handleClearFilters = () => {
    setActiveFilters({
      status: [],
      priority: [],
      category: [],
      tags: []
    });
    setSearchTerm('');
  };

  if (loading) {
    return <div className="tasks-loading">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="tasks-error">
        <p>{error}</p>
        <button onClick={() => fetchTasks({})}>Retry</button>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <button className="add-task-button" onClick={() => setShowModal(true)}>
          Add Task
        </button>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {(searchTerm || Object.values(activeFilters).some(arr => arr.length > 0)) && (
            <button onClick={handleClearFilters} className="clear-filters">
              Clear Filters
            </button>
          )}
        </div>

        <div className="filter-groups">
          <div className="filter-group">
            <h4>Status</h4>
            {[
              TaskStatus.PENDING,
              TaskStatus.IN_PROGRESS,
              TaskStatus.COMPLETED
            ].map((status) => (
              <label key={status} className="filter-option">
                <input
                  type="checkbox"
                  checked={activeFilters.status.includes(status)}
                  onChange={() => handleFilterChange('status', status)}
                />
                <span>{status}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Priority</h4>
            {[
              TaskPriority.LOW,
              TaskPriority.MEDIUM,
              TaskPriority.HIGH
            ].map((priority) => (
              <label key={priority} className="filter-option">
                <input
                  type="checkbox"
                  checked={activeFilters.priority.includes(priority)}
                  onChange={() => handleFilterChange('priority', priority)}
                />
                <span>{priority}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            {[
              TaskCategory.WORK,
              TaskCategory.PERSONAL,
              TaskCategory.SHOPPING,
              TaskCategory.HEALTH,
              TaskCategory.FINANCE,
              TaskCategory.OTHER
            ].map((category) => (
              <label key={category} className="filter-option">
                <input
                  type="checkbox"
                  checked={activeFilters.category.includes(category)}
                  onChange={() => handleFilterChange('category', category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Tags</h4>
            <div className="tags-input">
              <input
                type="text"
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    handleFilterChange('tags', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            <div className="active-tags">
              {activeFilters.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                  <button onClick={() => handleFilterChange('tags', tag)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tasks-list">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="no-tasks">No tasks found</div>
        ) : (
          getSortedTasks().map((task) => (
            <div key={task.id} className="task-item" data-status={task.status}>
              <div className="task-content" onClick={() => navigate(`/tasks/${task.id}`)}>
                <h3>{task.title}</h3>
                <div className="task-metadata">
                  <span className="priority-badge" data-priority={task.priority}>
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="due-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="status-badge" data-status={task.status}>
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
              </div>
              <div className="task-actions">
                <button
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask(task);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <TaskModal
          isOpen={true}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          onSubmit={async (taskData) => {
            try {
              if (selectedTask) {
                await updateTask(selectedTask.id, { ...selectedTask, ...taskData });
              } else {
                await createTask(taskData);
              }
              fetchTasks({});
            } catch (err) {
              console.error('Failed to save task', err);
            }
          }}
          initialTask={selectedTask || undefined}
        />
      )}
    </div>
  );
};

export default Tasks;
