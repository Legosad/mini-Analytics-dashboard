// server/routes/comment.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';

const router = express.Router();

// Add a comment to a post (logged-in users)
router.post('/:postId', protect, createComment);

// Get all comments for a post (public)
router.get('/:postId', getCommentsByPost);

// Update a comment (owner only)
router.put('/:commentId', protect, updateComment);

// Delete a comment (owner only)
router.delete('/:commentId', protect, deleteComment);

export default router;
