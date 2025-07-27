import { Request, Response } from 'express';
import { Note } from '../models/Note';

export const getNotes = async (req: Request, res: Response) => {
  const notes = await Note.find({ userId: req.user!._id }).sort({ createdAt: -1 });
  res.status(200).json(notes);
};

export const createNote = async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Note content cannot be empty' });
  }

  const note = new Note({
    userId: req.user!._id,
    content,
  });

  const createdNote = await note.save();
  res.status(201).json(createdNote);
};

export const deleteNote = async (req: Request, res: Response) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    // Add '!' to assert that req.user is not null
    if (note.userId.toString() !== req.user!._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await note.deleteOne();
    res.status(200).json({ message: 'Note removed' });
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
};