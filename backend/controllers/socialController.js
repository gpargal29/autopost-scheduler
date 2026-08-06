const SocialAccount = require('../models/SocialAccount');

// @desc    Get user connected social accounts (initializes defaults if none exist)
// @route   GET /api/social-accounts
// @access  Private
const getSocialAccounts = async (req, res, next) => {
  try {
    let accounts = await SocialAccount.find({ user: req.user._id });

    // Seed default social platforms for demo if empty
    if (accounts.length === 0) {
      const defaults = [
        { platform: 'LinkedIn', accountName: `${req.user.name}'s LinkedIn`, accountHandle: `@${req.user.name.toLowerCase().replace(/\s+/g, '')}`, isConnected: true },
        { platform: 'Instagram', accountName: `${req.user.name}'s Instagram`, accountHandle: `@${req.user.name.toLowerCase().replace(/\s+/g, '_')}_quotes`, isConnected: true },
        { platform: 'Facebook', accountName: `${req.user.name}'s Facebook Page`, accountHandle: `@${req.user.name.toLowerCase().replace(/\s+/g, '')}official`, isConnected: false },
      ];

      accounts = await SocialAccount.create(
        defaults.map((d) => ({ ...d, user: req.user._id }))
      );
    }

    res.status(200).json({
      success: true,
      accounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle connection status of a social account
// @route   PUT /api/social-accounts/:id/toggle
// @access  Private
const toggleSocialAccount = async (req, res, next) => {
  try {
    const account = await SocialAccount.findOne({ _id: req.params.id, user: req.user._id });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Social account not found',
      });
    }

    account.isConnected = !account.isConnected;
    account.lastSync = new Date();
    await account.save();

    res.status(200).json({
      success: true,
      account,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSocialAccounts,
  toggleSocialAccount,
};
