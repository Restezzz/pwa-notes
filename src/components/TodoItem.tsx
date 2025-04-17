import React from 'react';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';
import { Todo } from '../db';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete }) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <button 
        className={`complete-button ${todo.completed ? 'completed' : ''}`} 
        onClick={() => onToggleComplete(todo.id as number)}
        aria-label={todo.completed ? "Отметить как невыполненное" : "Отметить как выполненное"}
      >
        <FaCheck />
      </button>
      
      <div className="todo-content">
        <p className="todo-text">{todo.text}</p>
      </div>
      
      <button 
        className="delete-button" 
        onClick={() => onDelete(todo.id as number)}
        aria-label="Удалить задачу"
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};

export default TodoItem; 