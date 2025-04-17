import React, { useState } from 'react';

interface TodoFormProps {
  onAddTodo: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [todoText, setTodoText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (todoText.trim()) {
      onAddTodo(todoText.trim());
      setTodoText('');
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        placeholder="Добавить новую задачу..."
        aria-label="Текст задачи"
        className="todo-input"
      />
      <button 
        type="submit"
        className="add-todo-button"
        disabled={!todoText.trim()}
        aria-label="Добавить задачу"
      >
        Добавить
      </button>
    </form>
  );
};

export default TodoForm; 