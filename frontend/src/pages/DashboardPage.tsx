import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getNotes, createNote, deleteNote } from '../services/api';
import LogoIcon from '../assets/icon.png';
import { Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // console.log('User object in Dashboard:', user);

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An unknown error occurred while fetching notes.'
        );
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

  const handleCreateNoteSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newNote.trim()) {
    // Show error only on the screen
    setError('Note content cannot be empty.');
    return;
  }
  try {
    const createdNote = await createNote(newNote);
    setNotes([createdNote, ...notes]);
    setNewNote('');
    setIsCreating(false);
    setError(null);

    // Show success toast
    toast.success('Note created successfully!', { className: 'custom-toast' });
  } catch (err) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : 'An unknown error occurred while creating the note.';
    setError(errorMsg);
    toast.error(`Error: ${errorMsg}`, { className: 'custom-toast' });
  }
};

  const handleDeleteNote = async (id: string) => {
    // Added confirmation dialog before deleting a note
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this note?'
    );
    if (!confirmDelete) return;

    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note._id !== id));
      toast.success('Note deleted successfully!', { className: 'custom-toast' });
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'An unknown error occurred while deleting the note.';
      setError(errorMsg);
      toast.error(`Error: ${errorMsg}`, { className: 'custom-toast' });
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center px-4 py-10
                    sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40"
    >
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* --- Header --- */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-10">
        {/* Logo + Dashboard row */}
        <div className="flex items-center gap-3">
          <img src={LogoIcon} alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-medium text-gray-900 md:text-2xl">
            Dashboard
          </span>
        </div>
        {/* Sign Out Link */}
        <button
          onClick={handleLogout}
          className="text-[#367AFF] underline text-base font-bold hover:text-blue-600 md:text-base px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Sign Out"
        >
          Sign Out
        </button>
      </div>

      {/* --- Profile Card --- */}
      <div className="w-full max-w-4xl">
        <div
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6
                        md:p-8 md:mb-8"
        >
          <div className="text-xl font-bold mb-2 md:text-3xl">
            Welcome, {user?.name || 'User'} !
          </div>
          <div className="text-gray-800 text-md md:text-lg">
            Email: {user?.email || 'Email not available'}
          </div>
        </div>

        {/* --- Create Note Area --- */}
        {!isCreating ? (
          <button
            className="w-full max-w-sm bg-[#367AFF] hover:bg-blue-500 text-white py-3 rounded-lg font-semibold text-base shadow mb-8
                       md:max-w-md md:py-4 md:text-lg"
            onClick={() => setIsCreating(true)}
            disabled={loading}
          >
            Create Note
          </button>
        ) : (
          <form
            onSubmit={handleCreateNoteSubmit}
            className="mb-8 w-full max-w-4xl flex flex-col gap-3 md:flex-row md:items-center md:gap-4"
          >
            {/* Changed input to textarea for multiline notes */}
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Type your note here..."
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base md:flex-grow md:text-lg resize-y min-h-[3rem]"
              autoFocus
              rows={3}
              aria-label="New Note Content"
            />
            <div className="flex gap-3 md:flex-none">
              <button
                type="submit"
                className="bg-[#367AFF] text-white font-semibold px-6 py-2.5 rounded-lg shadow hover:bg-blue-500 transition md:px-8 md:py-3 md:text-lg"
              >
                Add Note
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewNote('');
                  setError(null);
                }}
                className="bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg shadow hover:bg-gray-400 transition md:px-6 md:py-3 md:text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* --- Notes Section --- */}
      <div className="w-full max-w-4xl">
        <div className="text-lg font-medium mb-4 text-gray-800 md:text-xl">Notes</div>
        <div className="space-y-4">
          {loading && (
            <div className="text-gray-400 text-center py-6">Loading notes...</div>
          )}
          {error && !loading && (
            <div className="text-red-500 text-center py-6">{error}</div>
          )}
          {!loading && notes.length === 0 && (
            <div className="text-gray-400 text-center py-6">No notes yet.</div>
          )}
          {/* Notes */}
          {notes.map((note) => (
            <div
              key={note._id}
              className="flex items-center justify-between bg-white rounded-lg shadow-md px-6 py-3 border border-gray-100
                          md:px-8 md:py-4"
            >
              {/* Added wrapping/truncation and tooltip on hover */}
              <span
                className="text-gray-900 text-base md:text-lg break-words max-w-[90%] whitespace-pre-wrap"
                title={note.content}
              >
                {note.content}
              </span>
              <button
                onClick={() => handleDeleteNote(note._id)}
                className="ml-2 p-2 rounded hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                title="Delete note"
                aria-label={`Delete note: ${note.content}`}
              >
                <Trash2 className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
