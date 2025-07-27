import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getNotes, createNote, deleteNote } from '../services/api'; 
import NoteItem from '../components/NoteItem'; 

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This effect runs once on component mount to check for a token from Google
  useEffect(() => {
    const googleToken = searchParams.get('token');
    if (googleToken) {
      login(googleToken);
      navigate('/dashboard', { replace: true });
    }
  }, [login, navigate, searchParams]);

  // This effect fetches notes after the user is confirmed
  useEffect(() => {
    // Only fetch notes if we have a user
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while fetching notes.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

    const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const createdNote = await createNote(newNote);
      setNotes([createdNote, ...notes]);
      setNewNote('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while creating the note.');
      }
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while deleting the note.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="mt-1 text-gray-600">Here are your notes.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="mb-8">
        <form onSubmit={handleCreateNote} className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Create a new note..."
            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Note
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {loading && <p>Loading notes...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && notes.length === 0 && (
          <p className="text-gray-500 text-center py-10">You don't have any notes yet. Add one above!</p>
        )}
        {notes.map((note) => (
          <NoteItem key={note._id} note={note} onDelete={handleDeleteNote} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;