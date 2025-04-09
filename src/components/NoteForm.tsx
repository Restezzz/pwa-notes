import React, { useState, useEffect } from 'react';
import { Note } from '../db';

interface NoteFormProps {
  currentNote: Note | null;
  onSave: (note: { title: string; content: string }, id?: number) => void;
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ currentNote, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Загружаем данные редактируемой заметки при открытии формы
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    } else {
      // Сбрасываем форму при создании новой заметки
      setTitle('');
      setContent('');
    }
  }, [currentNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация данных
    if (title.trim() === '') {
      alert('Заголовок не может быть пустым');
      return;
    }

    onSave(
      { title: title.trim(), content: content.trim() },
      currentNote?.id
    );
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Заголовок</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок"
          required
          autoFocus
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Содержание</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Введите текст заметки"
          rows={6}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="btn-save">
          {currentNote ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm; 