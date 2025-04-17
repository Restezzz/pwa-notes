import React from 'react';

export type FilterType = 'all' | 'active' | 'completed';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const TodoFilter: React.FC<TodoFilterProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="todo-filters">
      <button 
        className={`filter-button ${currentFilter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        Все
      </button>
      <button 
        className={`filter-button ${currentFilter === 'active' ? 'active' : ''}`}
        onClick={() => onFilterChange('active')}
      >
        Активные
      </button>
      <button 
        className={`filter-button ${currentFilter === 'completed' ? 'active' : ''}`}
        onClick={() => onFilterChange('completed')}
      >
        Выполненные
      </button>
    </div>
  );
};

export default TodoFilter; 