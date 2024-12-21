import React, { useState, useCallback, useEffect } from 'react';
import './Tasks.css';
import TaskModal from '../components/TaskModal';
import taskService, { Task, TaskSearchParams } from '../services/taskService';

type SortField = 'priority' | 'dueDate' | 'status';
type SortOrder = 'asc' | 'desc';

const KEYBOARD_SHORTCUTS = {
  'n': 'New Task',
  '/': 'Search',
  'f': 'Filter',
  'h': 'Show Shortcuts',
  'Escape': 'Close Modal/Menu'
};

// Custom debounce function with cancel capability
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debouncedFn.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  return debouncedFn;
}

const Tasks: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  const fetchTasks = useCallback(async (params: TaskSearchParams = {}) => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getTasks(params);
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term) {
        fetchTasks();
        return;
      }
      try {
        const results = await taskService.searchTasks(term);
        setTasks(results);
      } catch (err) {
        setError('Search failed');
        console.error('Search error:', err);
      }
    }, 300),
    []
  );

  // Search effect
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setIsModalOpen(true);
          }
          break;
        case '/':
          e.preventDefault();
          setIsSearching(true);
          break;
        case 'f':
          e.preventDefault();
          // Toggle filters visibility (you can add this feature)
          break;
        case 'h':
          e.preventDefault();
          setShowShortcuts(prev => !prev);
          break;
        case 'escape':
          e.preventDefault();
          setIsModalOpen(false);
          setMenuPosition(null);
          setIsSearching(false);
          setShowShortcuts(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Task handlers
  const handleAddTask = useCallback(async (taskData: Omit<Task, 'id' | 'status'>) => {
    try {
      await taskService.createTask(taskData);
      fetchTasks();
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  }, [fetchTasks]);

  const handleEditTask = useCallback(async (taskData: Omit<Task, 'id' | 'status'>) => {
    if (!editingTask) return;
    try {
      await taskService.updateTask(editingTask.id, taskData);
      fetchTasks();
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  }, [editingTask, fetchTasks]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
      setMenuPosition(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  }, [fetchTasks]);

  const handleStatusToggle = useCallback(async (taskId: string) => {
    try {
      await taskService.toggleTaskStatus(taskId);
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status');
      console.error('Error updating task status:', err);
    }
  }, [fetchTasks]);

  const handleSort = useCallback((field: SortField) => {
    setSortField(field);
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const handleMenuClick = useCallback((e: React.MouseEvent, taskId: string) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setSelectedTaskId(taskId);
  }, []);

  // Filter tasks
  const filteredAndSortedTasks = React.useMemo(() => {
    return tasks
      .filter(task => {
        if (filterStatus !== 'all' && task.status !== filterStatus) return false;
        if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const comparison = 
            priorityOrder[a.priority as keyof typeof priorityOrder] - 
            priorityOrder[b.priority as keyof typeof priorityOrder];
          return sortOrder === 'asc' ? comparison : -comparison;
        }
        if (sortField === 'dueDate') {
          if (!a.dueDate) return sortOrder === 'asc' ? 1 : -1;
          if (!b.dueDate) return sortOrder === 'asc' ? -1 : 1;
          return sortOrder === 'asc'
            ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        if (sortField === 'status') {
          const statusOrder = { completed: 3, 'in-progress': 2, pending: 1 };
          const comparison = 
            statusOrder[a.status as keyof typeof statusOrder] - 
            statusOrder[b.status as keyof typeof statusOrder];
          return sortOrder === 'asc' ? comparison : -comparison;
        }
        return 0;
      });
  }, [tasks, filterStatus, filterPriority, sortField, sortOrder]);

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <div className="header-actions">
          {isSearching && (
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          )}
          <button className="add-task-button" onClick={() => setIsModalOpen(true)}>
            + Add Task
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-container">
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Priority:</label>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => handleSort(e.target.value as SortField)}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
          <button
            className="sort-order-button"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="tasks-list">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="no-tasks">
              {searchTerm ? 'No tasks match your search' : 'No tasks yet'}
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-checkbox">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => handleStatusToggle(task.id)}
                  />
                </div>
                <div className="task-content">
                  <div
                    className="task-title"
                    style={{
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                    }}
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="task-description">{task.description}</div>
                  )}
                  <div className="task-details">
                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="status-badge">
                      {task.status}
                    </span>
                    {task.dueDate && (
                      <span className="due-date">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    className="action-button"
                    onClick={(e) => handleMenuClick(e, task.id)}
                  >
                    ⋮
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {menuPosition && selectedTaskId && (
        <div
          className="menu"
          style={{
            position: 'absolute',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          <div
            className="menu-item"
            onClick={() => {
              const task = tasks.find(t => t.id === selectedTaskId);
              if (task) {
                setEditingTask(task);
                setIsModalOpen(true);
              }
              setMenuPosition(null);
            }}
          >
            Edit
          </div>
          <div
            className="menu-item"
            onClick={() => {
              handleDeleteTask(selectedTaskId);
              setMenuPosition(null);
            }}
          >
            Delete
          </div>
          <div
            className="menu-item"
            onClick={() => {
              handleStatusToggle(selectedTaskId);
              setMenuPosition(null);
            }}
          >
            Toggle Status
          </div>
        </div>
      )}

      {showShortcuts && (
        <div className="shortcuts-modal">
          <div className="shortcuts-content">
            <h2>Keyboard Shortcuts</h2>
            <div className="shortcuts-list">
              {Object.entries(KEYBOARD_SHORTCUTS).map(([key, description]) => (
                <div key={key} className="shortcut-item">
                  <kbd>{key}</kbd>
                  <span>{description}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowShortcuts(false)}>Close</button>
          </div>
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        initialData={editingTask || undefined}
        mode={editingTask ? 'edit' : 'add'}
      />
    </div>
  );
};

export default Tasks;
