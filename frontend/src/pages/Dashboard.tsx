import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useTasks } from '../hooks/useTasks';
import { useTodos } from '../hooks/useTodos';
import { Todo, TodoStatus } from '../types/todo.types';
import TodoModal from '../components/TodoModal';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { getUpcomingTasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { todos, loading, error, handleToggleTodo, handleDeleteTodo, handleCreateTodo, handleUpdateTodo, setTodos } = useTodos();
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleBoxClick = (route: string, event: React.MouseEvent) => {
    // If the click is on an interactive element, don't navigate
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' || 
      target.tagName === 'BUTTON' ||
      target.closest('.task-item') ||
      target.closest('.note-item') ||
      target.closest('.event-item') ||
      target.closest('.add-note-btn')
    ) {
      return;
    }
    navigate(route);
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleNoteClick = (noteId: string) => {
    // Navigate to specific note
    console.log('Navigate to note:', noteId);
  };

  const handleEventClick = (eventId: string) => {
    // Navigate to specific event
    console.log('Navigate to event:', eventId);
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return;
    
    try {
      await handleUpdateTodo(id, { title: editText.trim() });
      const updatedTodos = todos.map(todo => 
        todo.id === id ? { ...todo, title: editText.trim() } : todo
      );
      setTodos(updatedTodos);
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  // Get the 2 most urgent upcoming tasks
  const upcomingTasks = getUpcomingTasks(2);

  return (
    <div className="dashboard">
      <div className="bento-grid">
        <div 
          className="bento-box tasks-box"
          onClick={(e) => handleBoxClick('/tasks', e)}
        >
          <div className="bento-box-header">
            <h2>Tasks</h2>
          </div>
          <div className="bento-box-content">
            {tasksLoading ? (
              <div className="loading">Loading tasks...</div>
            ) : tasksError ? (
              <div className="error">{tasksError}</div>
            ) : (
              <div className="task-list">
                {upcomingTasks.map(task => (
                  <div 
                    key={task.id}
                    className="task-item-dashboard"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task.id);
                    }}
                  >
                    <div className={`task-status ${task.status}`}></div>
                    <div className="task-info">
                      <span className="task-title">{task.title}</span>
                      <span className="task-due">
                        Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </span>
                    </div>
                    {task.priority && (
                      <div className={`task-priority ${task.priority}`}>
                        {task.priority}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div 
          className="bento-box calendar-view-box"
          onClick={(e) => handleBoxClick('/calendar', e)}
        >
          <div className="bento-box-header">
            <h2>Calendar</h2>
          </div>
          <div className="bento-box-content">
            <div className="mini-calendar">
              <div className="calendar-header">
                <span>December 2024</span>
              </div>
              <div className="calendar-grid">
                <div className="calendar-placeholder">
                  Calendar View Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="bento-box notes-box"
          onClick={(e) => handleBoxClick('/notes', e)}
        >
          <div className="bento-box-header">
            <h2>Quick Notes</h2>
          </div>
          <div className="bento-box-content">
            <div className="notes-list">
              <div 
                className="note-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNoteClick('note1');
                }}
              >
                <div className="note-content">
                  <h3>Project Ideas</h3>
                  <p>- Implement new dashboard features<br/>- Add dark mode support<br/>- Optimize mobile view</p>
                </div>
                <span className="note-time">2 hours ago</span>
              </div>
              <div 
                className="note-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNoteClick('note2');
                }}
              >
                <div className="note-content">
                  <h3>Meeting Notes</h3>
                  <p>Discussed upcoming features and timeline for Q1 2024</p>
                </div>
                <span className="note-time">Yesterday</span>
              </div>
            </div>
            <button 
              className="add-note-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/notes/new');
              }}
            >
              <i className="fas fa-plus"></i> Quick Note
            </button>
          </div>
        </div>

        <div 
          className="bento-box todos-box"
          onClick={(e) => handleBoxClick('/todos', e)}
        >
          <div className="bento-box-header">
            <h2>To-dos</h2>
            <button 
              className="add-todo-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowTodoModal(true);
              }}
            >
              Add
            </button>
          </div>
          <div className="bento-box-content">
            {loading ? (
              <div className="loading">Loading todos...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <>
                <div className="todo-list">
                  {todos
                    .filter(todo => todo.status !== TodoStatus.COMPLETED)
                    .concat(todos.filter(todo => todo.status === TodoStatus.COMPLETED))
                    .slice(0, 2)
                    .map((todo: Todo) => (
                      <div key={todo.id} className="todo-item">
                        <input 
                          type="checkbox"
                          checked={todo.status === TodoStatus.COMPLETED}
                          onChange={() => handleToggleTodo(todo.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {editingId === todo.id ? (
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onBlur={() => handleSaveEdit(todo.id)}
                            onKeyDown={(e) => handleKeyDown(e, todo.id)}
                            className="todo-edit-input"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span 
                            className={todo.status === TodoStatus.COMPLETED ? 'completed' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(todo);
                            }}
                          >
                            {todo.title}
                          </span>
                        )}
                        {todo.status === TodoStatus.COMPLETED && (
                          <button 
                            className="delete-todo-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTodo(todo.id);
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  {todos.length === 0 && (
                    <div className="todo-empty">No todos yet</div>
                  )}
                </div>
                {todos.length > 2 && (
                  <div className="view-more-todos">
                    <span onClick={(e) => {
                      e.stopPropagation();
                      navigate('/todos');
                    }}>
                      View more ({todos.length - 2})
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          {showTodoModal && (
            <TodoModal
              isOpen={showTodoModal}
              onClose={() => setShowTodoModal(false)}
              onSubmit={async (todoData) => {
                await handleCreateTodo(todoData);
                setShowTodoModal(false);
              }}
            />
          )}
        </div>

        <div 
          className="bento-box upcoming-box"
          onClick={(e) => handleBoxClick('/calendar', e)}
        >
          <div className="bento-box-header">
            <h2>Upcoming</h2>
          </div>
          <div className="bento-box-content">
            <div className="event-list">
              <div 
                className="event-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick('event1');
                }}
              >
                <div className="event-time">10:00 AM</div>
                <div className="event-details">
                  <h3>Team Standup</h3>
                  <p>Daily sync meeting</p>
                </div>
              </div>
              <div 
                className="event-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick('event2');
                }}
              >
                <div className="event-time">2:00 PM</div>
                <div className="event-details">
                  <h3>Client Meeting</h3>
                  <p>Project review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;