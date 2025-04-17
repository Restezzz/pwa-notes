import { useState, useEffect } from 'react';
import { Todo, addTodo, toggleTodoComplete, deleteTodo, getAllTodos, getActiveTodos, getCompletedTodos } from './db';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';
import TodoFilter, { FilterType } from './components/TodoFilter';
import NotificationButton from './components/NotificationButton';
import OfflineIndicator from './components/OfflineIndicator';
import { FaPlus } from 'react-icons/fa';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(window.shouldOpenNewTaskForm || false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  // Очищаем параметр URL после использования
  useEffect(() => {
    if (window.shouldOpenNewTaskForm) {
      window.shouldOpenNewTaskForm = false;
      
      // Очищаем URL
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  // Загрузка задач при монтировании компонента и изменении фильтра
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        
        // Загружаем задачи в зависимости от выбранного фильтра
        let fetchedTodos: Todo[];
        
        switch (currentFilter) {
          case 'active':
            fetchedTodos = await getActiveTodos();
            break;
          case 'completed':
            fetchedTodos = await getCompletedTodos();
            break;
          default: // 'all'
            fetchedTodos = await getAllTodos();
            break;
        }
        
        setTodos(fetchedTodos);
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [currentFilter]);

  // Обработчик для добавления новой задачи
  const handleAddTodo = async (text: string) => {
    try {
      // Добавляем задачу в БД
      const newTodoId = await addTodo(text);
      
      // Если у нас не фильтр "Выполненные", то показываем новую задачу
      if (currentFilter !== 'completed') {
        const newTodo: Todo = {
          id: newTodoId as number,
          text,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setTodos(prevTodos => [newTodo, ...prevTodos]);
      }
      
      // Закрываем форму
      setIsFormOpen(false);
      
      // Отправляем уведомление о новой задаче, если есть право на уведомления
      if (Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification('Умный список задач', {
          body: `Новая задача добавлена: ${text}`,
          icon: '/icons/note-icon192.png'
        });
      }
    } catch (error) {
      console.error('Ошибка при сохранении задачи:', error);
      alert('Не удалось сохранить задачу');
    }
  };

  // Обработчик для изменения статуса задачи
  const handleToggleComplete = async (id: number) => {
    try {
      await toggleTodoComplete(id);
      
      // Находим задачу в текущем списке
      const todo = todos.find(t => t.id === id);
      
      if (todo) {
        // Если мы переключаем на статус, который не соответствует текущему фильтру,
        // удаляем задачу из списка
        if (
          (currentFilter === 'active' && !todo.completed) || 
          (currentFilter === 'completed' && todo.completed)
        ) {
          setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
        } else {
          // Иначе обновляем статус в интерфейсе
          setTodos(prevTodos => 
            prevTodos.map(t => 
              t.id === id 
                ? { ...t, completed: !t.completed, updatedAt: new Date() } 
                : t
            )
          );
        }
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса задачи:', error);
    }
  };

  // Обработчик для удаления задачи
  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await deleteTodo(id);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
        alert('Не удалось удалить задачу');
      }
    }
  };

  // Обработчик изменения фильтра
  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
  };

  return (
    <div className="app">
      <OfflineIndicator />
      
      <header className="app-header">
        <h1>Умный список задач</h1>
        <div className="header-buttons">
          <NotificationButton />
          <button 
            className="add-button" 
            onClick={() => setIsFormOpen(true)}
            aria-label="Добавить задачу"
          >
            <FaPlus />
          </button>
        </div>
      </header>

      <main className="app-main">
        <TodoFilter 
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
        />
        
        {isLoading ? (
          <div className="loading">Загрузка задач...</div>
        ) : isFormOpen ? (
          <TodoForm onAddTodo={handleAddTodo} />
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <p>
              {currentFilter === 'all' 
                ? 'У вас пока нет задач' 
                : currentFilter === 'active' 
                  ? 'У вас нет активных задач'
                  : 'У вас нет выполненных задач'
              }
            </p>
            <button className="btn-primary" onClick={() => setIsFormOpen(true)}>
              Создать новую задачу
            </button>
          </div>
        ) : (
          <div className="todos-list">
            {todos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggleComplete={handleToggleComplete} 
                onDelete={handleDeleteTodo} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
