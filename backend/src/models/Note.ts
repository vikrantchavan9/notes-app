import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
  userId: Schema.Types.ObjectId; 
  content: string;
}


const noteSchema = new Schema<INote>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { type: String, required: true },
}, { 
  timestamps: true 
});

export const Note = model<INote>('Note', noteSchema);