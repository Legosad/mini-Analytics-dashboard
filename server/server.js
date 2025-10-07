import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/post.js"
import commentRoutes from "./routes/comment.js"
import insightRoutes from "./routes/insights.js"

dotenv.config()

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Blog Analytics API is running!' 
  });
});

app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comment", commentRoutes)
app.use('/api/insights', insightRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});



