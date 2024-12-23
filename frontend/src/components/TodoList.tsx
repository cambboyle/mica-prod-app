import React from 'react';
import { Todo } from '../types/todo.types';
import TodoItem from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle }) => {
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>No todos yet</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default TodoList;
