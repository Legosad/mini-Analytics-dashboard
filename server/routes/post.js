import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', protect, createPost);

// @route   GET /api/posts
// @desc    Get all posts with comment count (supports search, filter, pagination)
router.get('/', getAllPosts);

// @route   GET /api/posts/:id
// @desc    Get single post by ID
router.get('/:id', getPostById);

// @route   PUT /api/posts/:id
// @desc    Update a post
router.put('/:id', protect, updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
router.delete('/:id', protect, deletePost);

export default router;