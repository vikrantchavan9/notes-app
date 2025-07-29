import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/noteController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);
  
router.route('/:id')
  .delete(deleteNote);

export default router;