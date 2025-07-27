import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const registerUser = async (userData: RegisterData) => {
  try {
    const { data } = await apiClient.post('/users/register', userData);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || 'An error occurred during registration.');
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const { data } = await apiClient.post('/users/verify-otp', { email, otp });
    return data; 
  } catch (error) {
    throw new Error(getErrorMessage(error) || 'An error occurred during OTP verification.');
  }
};

export const getNotes = async () => {
    try {
        const { data } = await apiClient.get('/notes');
        return data;
    } catch (error) {
        throw new Error(getErrorMessage(error) || 'Could not fetch notes.');
    }
};

export const createNote = async (content: string) => {
    try {
        const { data } = await apiClient.post('/notes', { content });
        return data;
    } catch (error) {
        throw new Error(getErrorMessage(error) || 'Could not create note.');
    }
};

export const deleteNote = async (noteId: string) => {
    try {
        const { data } = await apiClient.delete(`/notes/${noteId}`);
        return data;
    } catch (error) {
        throw new Error(getErrorMessage(error) || 'Could not delete note.');
    }
};