import React, { useState, useEffect } from 'react';
import { Todo, TodoStatus } from '../types/todo.types';
import TodoModal from '../components/TodoModal';
import todoService from '../services/todoService';
import './Todos.css';

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getTodos({});
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreateTodo = async (todoData: Partial<Todo>) => {
    try {
      await todoService.createTodo(todoData);
      fetchTodos();
    } catch (err) {
      console.error('Error creating todo:', err);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      await todoService.toggleTodoStatus(id);
      fetchTodos();
    } catch (err) {
      console.error('Error toggling todo status:', err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      fetchTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return;
    
    try {
      const updatedTodo = await todoService.updateTodo(id, { title: editText.trim() });
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
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

  return (
    <div className="todos-page">
      <div className="todos-header">
        <h1>Todos</h1>
        <button className="add-todo-btn" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Add Todo
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading todos...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="todos-list">
          {todos.map((todo: Todo) => (
            <div key={todo.id} className="todo-item">
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.status === TodoStatus.COMPLETED}
                  onChange={() => handleToggleTodo(todo.id)}
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
                  />
                ) : (
                  <span
                    className={todo.status === TodoStatus.COMPLETED ? 'completed' : ''}
                    onClick={() => handleStartEdit(todo)}
                  >
                    {todo.title}
                  </span>
                )}
              </div>
              <button
                className="delete-todo-btn"
                onClick={() => handleDeleteTodo(todo.id)}
                title="Remove todo"
              >
                <i className="fas fa-trash"></i>
                Remove
              </button>
            </div>
          ))}
          {todos.length === 0 && (
            <div className="todos-empty">No todos yet</div>
          )}
        </div>
      )}

      {showModal && (
        <TodoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateTodo}
        />
      )}
    </div>
  );
};

export default Todos;
