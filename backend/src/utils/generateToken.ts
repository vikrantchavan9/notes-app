import jwt from 'jsonwebtoken';
import { IUser } from '../models/User'; 

const generateToken = (user: IUser): string => {

  return jwt.sign(
    { 
      id: user._id,
      name: user.name,
      email: user.email 
    }, 
    process.env.JWT_SECRET!, 
    {
      expiresIn: '30d',
    }
  );
};

export default generateToken;