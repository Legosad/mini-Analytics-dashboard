import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Public
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body; // ⬅️ no 'author' from client
    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide title and content" });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user.username, // ⬅️ take from authenticated user
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all posts with comment count
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req, res) => {
  try {
    const { author, search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};

    // Filter by author (bonus feature)
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    // Search in title or content (bonus feature)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination (bonus feature)
    const skip = (page - 1) * limit;

    // Get posts with comment count using aggregation
    const posts = await Post.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
        },
      },
      {
        $project: {
          comments: 0, // Don't include full comments array
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Get comment count
    const commentCount = await Comment.countDocuments({ post: post._id });

    res.status(200).json({
      success: true,
      data: {
        ...post.toObject(),
        commentCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.author !== req.user.username) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    if (post.author !== req.user.username) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: req.params.id });

    res.status(200).json({
      success: true,
      message: "Post and associated comments deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
