// server/controllers/insightsController.js
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

/** helper: build YYYY-MM-DD map covering a range so missing days show as 0 */
const buildDailySeries = (countsArr, startDate, days) => {
  const map = new Map(countsArr.map(d => [d._id, d.count]));
  const series = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: map.get(key) || 0 });
  }
  return series;
};

/** GET /api/insights/overview?days=7 */
export const getOverview = async (req, res) => {
  try {
    const days = Math.max(1, Math.min(90, parseInt(req.query.days ?? '7', 10)));
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    // Totals
    const [totalPosts, totalComments] = await Promise.all([
      Post.countDocuments({}),
      Comment.countDocuments({})
    ]);

    // Posts per day
    const postsDaily = await Post.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Comments per day
    const commentsDaily = await Comment.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Leaders
    const topAuthors = await Post.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topCommenters = await Comment.aggregate([
      { $group: { _id: '$commenter', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        totals: { posts: totalPosts, comments: totalComments },
        timeseries: {
          posts: buildDailySeries(postsDaily, start, days),
          comments: buildDailySeries(commentsDaily, start, days)
        },
        leaders: {
          authors: topAuthors.map(x => ({ author: x._id, posts: x.count })),
          commenters: topCommenters.map(x => ({ commenter: x._id, comments: x.count }))
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** GET /api/insights/top-posts?limit=5 */
export const getTopPostsByComments = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(20, parseInt(req.query.limit ?? '5', 10)));

    const ranked = await Comment.aggregate([
      { $group: { _id: '$post', commentCount: { $sum: 1 } } },
      { $sort: { commentCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'post'
        }
      },
      { $unwind: '$post' },
      {
        $project: {
          _id: 0,
          postId: '$post._id',
          title: '$post.title',
          author: '$post.author',
          commentCount: 1,
          createdAt: '$post.createdAt'
        }
      }
    ]);

    res.json({ success: true, data: ranked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** GET /api/insights/recent-activity?limit=10 */
export const getRecentActivity = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit ?? '10', 10)));

    const [recentPosts, recentComments] = await Promise.all([
      Post.find({}).sort({ createdAt: -1 }).limit(limit).select('title author createdAt'),
      Comment.find({}).sort({ createdAt: -1 }).limit(limit).select('text commenter post createdAt')
    ]);

    res.json({
      success: true,
      data: { posts: recentPosts, comments: recentComments }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
