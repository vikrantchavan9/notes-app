import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import noteRoutes from './routes/noteRoutes';
import passport from 'passport'; 

dotenv.config();

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID); 

import './config/passport'; 

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes); 
app.use('/api/notes', noteRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));