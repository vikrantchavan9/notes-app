import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  dob?: string;
  password?: string; 
  googleId?: string;
  otp?: string;
  otpExpires?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: String },
  password: { type: String },
  googleId: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
}, { 
  timestamps: true 
});

export const User = model<IUser>('User', userSchema);