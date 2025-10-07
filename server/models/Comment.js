import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    commenter: {
      type: String,
      required: [true, 'Commenter name is required'],
      trim: true,
      maxlength: [100, 'Commenter name cannot exceed 100 characters']
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required']
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
commentSchema.index({ post: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;