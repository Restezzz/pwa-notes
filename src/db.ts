import Dexie, { Table } from 'dexie';

// Интерфейс заметки (оставляем для обратной совместимости)
export interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс задачи
export interface Todo {
  id?: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Класс базы данных
class AppDatabase extends Dexie {
  notes!: Table<Note>;
  todos!: Table<Todo>;

  constructor() {
    super('todosDb');
    this.version(1).stores({
      notes: '++id, title, createdAt, updatedAt'
    });
    
    // Добавляем новую таблицу для задач
    this.version(2).stores({
      notes: '++id, title, createdAt, updatedAt',
      todos: '++id, text, completed, createdAt, updatedAt'
    });
  }
}

// Создаем инстанс базы данных
export const db = new AppDatabase();

// Функции для работы с задачами
export const addTodo = async (text: string) => {
  const now = new Date();
  return await db.todos.add({
    text,
    completed: false,
    createdAt: now,
    updatedAt: now
  });
};

export const toggleTodoComplete = async (id: number) => {
  const todo = await db.todos.get(id);
  if (todo) {
    return await db.todos.update(id, {
      completed: !todo.completed,
      updatedAt: new Date()
    });
  }
  return false;
};

export const updateTodo = async (id: number, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
  return await db.todos.update(id, {
    ...updates,
    updatedAt: new Date()
  });
};

export const deleteTodo = async (id: number) => {
  return await db.todos.delete(id);
};

export const getAllTodos = async () => {
  return await db.todos.orderBy('createdAt').reverse().toArray();
};

export const getActiveTodos = async () => {
  return await db.todos.filter(todo => !todo.completed).toArray();
};

export const getCompletedTodos = async () => {
  return await db.todos.filter(todo => todo.completed).toArray();
};

// Сохраняем функции для работы с заметками для обратной совместимости
export const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date();
  return await db.notes.add({
    ...note,
    createdAt: now,
    updatedAt: now
  });
};

export const updateNote = async (id: number, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
  return await db.notes.update(id, {
    ...updates,
    updatedAt: new Date()
  });
};

export const deleteNote = async (id: number) => {
  return await db.notes.delete(id);
};

export const getAllNotes = async () => {
  return await db.notes.orderBy('updatedAt').reverse().toArray();
};

export const getNoteById = async (id: number) => {
  return await db.notes.get(id);
}; 