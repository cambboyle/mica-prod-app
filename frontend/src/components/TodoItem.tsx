import React from 'react';
import { Todo, TodoStatus } from '../types/todo.types';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  return (
    <div className="todo-item">
      <label className="todo-checkbox-label">
        <input
          type="checkbox"
          checked={todo.status === TodoStatus.COMPLETED}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
        />
        <span className={`todo-title ${todo.status === TodoStatus.COMPLETED ? 'completed' : ''}`}>
          {todo.title}
        </span>
      </label>
    </div>
  );
};

export default TodoItem;
