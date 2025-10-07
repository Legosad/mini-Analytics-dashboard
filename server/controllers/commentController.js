// server/controllers/commentController.js
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// POST /api/comments/:postId  (auth)
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const post = await Post.findById(postId).select('_id');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      text: text.trim(),
      commenter: req.user.username, // from protect middleware
      post: postId,
    });

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/comments/:postId  (public)  — supports pagination
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const post = await Post.findById(postId).select('_id');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [comments, total] = await Promise.all([
      Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Comment.countDocuments({ post: postId }),
    ]);

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/comments/:commentId  (auth, comment owner only)
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Only the comment's author can update
    if (comment.commenter !== req.user.username) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this comment' });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    comment.text = text.trim();
    await comment.save();

    res.status(200).json({ success: true, data: comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/comments/:commentId  
// (auth, comment owner OR post owner)
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Fetch post to check its author
    const post = await Post.findById(comment.post);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Associated post not found' });
    }

    const isCommentOwner = comment.commenter === req.user.username;
    const isPostOwner = post.author === req.user.username;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
