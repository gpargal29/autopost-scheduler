const Quote = require('../models/Quote');
const SocialAccount = require('../models/SocialAccount');

// @desc    Get dashboard statistics & analytics aggregate data
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Counts by status
    const totalQuotes = await Quote.countDocuments({ user: userId });
    const pendingCount = await Quote.countDocuments({ user: userId, status: 'Pending' });
    const scheduledCount = await Quote.countDocuments({ user: userId, status: 'Scheduled' });
    const postedCount = await Quote.countDocuments({ user: userId, status: 'Posted' });
    const failedCount = await Quote.countDocuments({ user: userId, status: 'Failed' });

    // Connected social accounts count
    const connectedAccountsCount = await SocialAccount.countDocuments({ user: userId, isConnected: true });

    // Category breakdown
    const categoryStats = await Quote.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent activity stream (last 5 created or posted quotes)
    const recentActivity = await Quote.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(5);

    // Upcoming scheduled posts
    const upcomingScheduled = await Quote.find({ user: userId, status: 'Scheduled' })
      .sort({ scheduledAt: 1 })
      .limit(3);

    res.status(200).json({
      success: true,
      stats: {
        totalQuotes,
        pendingCount,
        scheduledCount,
        postedCount,
        failedCount,
        connectedAccountsCount,
      },
      categoryStats,
      recentActivity,
      upcomingScheduled,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
};
