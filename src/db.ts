import Dexie, { Table } from 'dexie';

// Интерфейс заметки
export interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Класс базы данных
class NotesDatabase extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('notesDb');
    this.version(1).stores({
      notes: '++id, title, createdAt, updatedAt'
    });
  }
}

// Создаем инстанс базы данных
export const db = new NotesDatabase();

// Функции для работы с заметками
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