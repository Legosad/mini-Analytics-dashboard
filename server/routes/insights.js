// server/routes/insights.js
import express from 'express';
import { getOverview, getTopPostsByComments, getRecentActivity } from '../controllers/insightControllers.js';
// If you ever want to make these private, switch to: import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public read-only insights
router.get('/overview', getOverview);                 // ?days=7|14|30 (default 7)
router.get('/top-posts', getTopPostsByComments);      // ?limit=5
router.get('/recent-activity', getRecentActivity);    // ?limit=10

export default router;
