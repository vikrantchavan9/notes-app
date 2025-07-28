import axios from 'axios';
const API_ROOT_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Set up axios to talk to the backend
const apiClient = axios.create({
  baseURL: API_ROOT_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the token to every request if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get a simple error message from any error
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred.';
};

interface RegisterData {
  name: string;
  email: string;
  dob: string;
}

// Register a new user
export const registerUser = async (userData: RegisterData) => {
  try {
    const { data } = await apiClient.post('/users/register', userData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || 'An error occurred during registration.');
  }
};

// Ask for a login code (OTP)
export const requestLoginOtp = async (email: string) => {
    try {
        const { data } = await apiClient.post('/users/login', { email });
        return data; // Returns a success message
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('An unknown error occurred while requesting OTP.');
    }
};

// Check if the OTP is correct
export const verifyOtp = async (email: string, otp: string) => {
  try {
    const { data } = await apiClient.post('/users/verify-otp', { email, otp });
    return data; 
  } catch (error) {
    throw new Error(getErrorMessage(error) || 'An error occurred during OTP verification.');
  }
};

// Get all notes for the user
export const getNotes = async () => {
    try {
        const { data } = await apiClient.get('/notes');
        return data;
    } catch (error) {
        throw new Error(getErrorMessage(error) || 'Could not fetch notes.');
    }
};

// Make a new note
export const createNote = async (content: string) => {
    try {
        const { data } = await apiClient.post('/notes', { content });
        return data;
    } catch (error) {
        throw new Error(getErrorMessage(error) || 'Could not create note.');
    }
};

// Delete a note by its ID
export const deleteNote = async (noteId: string) => {
    try {
        const { data } = await apiClient.delete(`/notes/${noteId}`);
        return data;
    } catch (error) {
        throw new Error(getErrorMessage(error) || 'Could not delete note.');
    }
};