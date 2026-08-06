const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platform: {
      type: String,
      enum: ['LinkedIn', 'Instagram', 'Facebook'],
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountHandle: {
      type: String,
      required: true,
    },
    isConnected: {
      type: Boolean,
      default: true,
    },
    lastSync: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate platform connections per user
socialAccountSchema.index({ user: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
