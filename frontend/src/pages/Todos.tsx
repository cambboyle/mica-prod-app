import React, { useState, useEffect } from 'react';
import { Todo } from '../types/todo.types';
import TodoList from '../components/TodoList';
import TodoModal from '../components/TodoModal';
import todoService from '../services/todoService';
import './Todos.css';

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="todos-page">
      <div className="todos-header">
        <h1>To-Do List</h1>
        <button
          onClick={() => setShowModal(true)}
          className="add-todo-button"
        >
          Add Todo
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
        />
      )}

      <TodoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateTodo}
      />
    </div>
  );
};

export default Todos;
