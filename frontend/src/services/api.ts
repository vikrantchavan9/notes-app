import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RegisterData {
  name: string;
  email: string;
  dob: string;
}

export const registerUser = async (userData: RegisterData) => {
  try {
    const { data } = await apiClient.post('/users/register', userData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An error occurred during registration.');
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const { data } = await apiClient.post('/users/verify-otp', { email, otp });
    return data; // This will return the user object and the token
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An error occurred during OTP verification.');
  }
};