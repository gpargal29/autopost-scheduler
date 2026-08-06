const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quote: {
      type: String,
      required: [true, 'Quote text is required'],
      trim: true,
    },
    author: {
      type: String,
      default: 'AI Generated',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Motivation',
        'Success',
        'Leadership',
        'Business',
        'Productivity',
        'Fitness',
        'Self Improvement',
        'Positivity',
        'Entrepreneurship',
        'Mindfulness',
        'Happiness',
        'Wisdom',
      ],
    },
    caption: {
      type: String,
      default: '',
    },
    explanation: {
      type: String,
      default: '',
    },
    hashtags: [
      {
        type: String,
      },
    ],
    emojiSuggestions: [
      {
        type: String,
      },
    ],
    imagePrompt: {
      type: String,
      default: '',
    },
    suggestedPostingTime: {
      type: String,
      default: '09:00 AM',
    },
    engagementSuggestions: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Scheduled', 'Posted', 'Failed'],
      default: 'Pending',
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    postedAt: {
      type: Date,
      default: null,
    },
    platforms: [
      {
        type: String,
        enum: ['LinkedIn', 'Instagram', 'Facebook'],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add text index for search capabilities
quoteSchema.index({ quote: 'text', caption: 'text', category: 'text' });

module.exports = mongoose.model('Quote', quoteSchema);
