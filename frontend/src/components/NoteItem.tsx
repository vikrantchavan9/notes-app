import React from 'react';
import { Trash2 } from 'lucide-react';

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void; 
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onDelete }) => {
  return (
    <div className="bg-yellow-100 p-4 rounded-lg shadow-sm flex justify-between items-start">
      <div>
        <p className="text-gray-800">{note.content}</p>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>
      <button 
        onClick={() => onDelete(note._id)}
        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
        aria-label="Delete note"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default NoteItem;