import { useState, useEffect } from 'react';
import { Note, addNote, updateNote, deleteNote, getAllNotes } from './db';
import NoteItem from './components/NoteItem';
import NoteForm from './components/NoteForm';
import OfflineIndicator from './components/OfflineIndicator';
import { FaPlus } from 'react-icons/fa';
import './App.css';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка заметок при монтировании компонента
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notes = await getAllNotes();
        setNotes(notes);
      } catch (error) {
        console.error('Ошибка при загрузке заметок:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Обработчик для сохранения заметки (создание или обновление)
  const handleSaveNote = async (noteData: { title: string; content: string }, id?: number) => {
    try {
      if (id) {
        // Обновление существующей заметки
        await updateNote(id, noteData);
        
        // Обновляем состояние
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === id 
              ? { ...note, ...noteData, updatedAt: new Date() } 
              : note
          )
        );
      } else {
        // Создание новой заметки
        const newNoteId = await addNote(noteData);
        
        // Обновляем состояние
        const newNote: Note = {
          id: newNoteId as number,
          ...noteData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setNotes(prevNotes => [newNote, ...prevNotes]);
      }
      
      // Закрываем форму
      handleCancelForm();
    } catch (error) {
      console.error('Ошибка при сохранении заметки:', error);
      alert('Не удалось сохранить заметку');
    }
  };

  // Обработчик для удаления заметки
  const handleDeleteNote = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заметку?')) {
      try {
        await deleteNote(id);
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      } catch (error) {
        console.error('Ошибка при удалении заметки:', error);
        alert('Не удалось удалить заметку');
      }
    }
  };

  // Обработчик для открытия формы редактирования
  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsFormOpen(true);
  };

  // Обработчик для открытия формы создания
  const handleNewNote = () => {
    setCurrentNote(null);
    setIsFormOpen(true);
  };

  // Обработчик для закрытия формы
  const handleCancelForm = () => {
    setIsFormOpen(false);
    setCurrentNote(null);
  };

  return (
    <div className="app">
      <OfflineIndicator />
      
      <header className="app-header">
        <h1>PWA Заметки</h1>
        <button 
          className="add-button" 
          onClick={handleNewNote}
          aria-label="Добавить заметку"
        >
          <FaPlus />
        </button>
      </header>

      <main className="app-main">
        {isLoading ? (
          <div className="loading">Загрузка заметок...</div>
        ) : isFormOpen ? (
          <NoteForm 
            currentNote={currentNote} 
            onSave={handleSaveNote} 
            onCancel={handleCancelForm} 
          />
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <p>У вас пока нет заметок</p>
            <button className="btn-primary" onClick={handleNewNote}>
              Создать первую заметку
            </button>
          </div>
        ) : (
          <div className="notes-list">
            {notes.map(note => (
              <NoteItem 
                key={note.id} 
                note={note} 
                onEdit={handleEditNote} 
                onDelete={handleDeleteNote} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
