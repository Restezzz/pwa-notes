import React from 'react';
import { Note } from '../db';
import { FaTrash, FaEdit } from 'react-icons/fa';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit, onDelete }) => {
  // Форматирование даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="note-item">
      <div className="note-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          <button 
            className="icon-button" 
            onClick={() => onEdit(note)}
            aria-label="Редактировать заметку"
          >
            <FaEdit />
          </button>
          <button 
            className="icon-button" 
            onClick={() => onDelete(note.id!)}
            aria-label="Удалить заметку"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="note-content">{note.content}</div>
      <div className="note-footer">
        <span className="note-date">
          Обновлено: {formatDate(note.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export default NoteItem; 