const Quote = require('../models/Quote');
const { generateQuoteAI } = require('../services/openaiService');

// @desc    Generate AI Quote metadata (unpersisted)
// @route   POST /api/quotes/generate
// @access  Private
const generateQuote = async (req, res, next) => {
  try {
    const { category, customTopic, tone, targetAudience } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Please select a quote category',
      });
    }

    // Call AI Service
    const aiResult = await generateQuoteAI({
      category,
      customTopic,
      tone,
      targetAudience,
    });

    // Return unpersisted AI generated quote object
    const generatedContent = {
      category,
      quote: aiResult.quote,
      author: aiResult.author,
      caption: aiResult.caption,
      explanation: aiResult.explanation,
      hashtags: aiResult.hashtags,
      emojiSuggestions: aiResult.emojiSuggestions,
      imagePrompt: aiResult.imagePrompt,
      suggestedPostingTime: aiResult.suggestedPostingTime,
      engagementSuggestions: aiResult.engagementSuggestions,
      status: 'Pending',
    };

    res.status(200).json({
      success: true,
      quote: generatedContent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Save a new quote record in MongoDB Atlas
// @route   POST /api/quotes
// @access  Private
const createQuote = async (req, res, next) => {
  try {
    const {
      category,
      quote,
      author,
      caption,
      explanation,
      hashtags,
      emojiSuggestions,
      imagePrompt,
      suggestedPostingTime,
      engagementSuggestions,
      status = 'Pending',
      scheduledAt = null,
      postedAt = null,
      platforms = [],
    } = req.body;

    if (!quote || !category) {
      return res.status(400).json({
        success: false,
        message: 'Quote text and category are required',
      });
    }

    const newQuote = await Quote.create({
      user: req.user._id,
      category,
      quote,
      author: author || 'AI Generated',
      caption,
      explanation,
      hashtags,
      emojiSuggestions,
      imagePrompt,
      suggestedPostingTime,
      engagementSuggestions,
      status,
      scheduledAt,
      postedAt,
      platforms,
    });

    res.status(201).json({
      success: true,
      quote: newQuote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user quotes with search and filter options
// @route   GET /api/quotes
// @access  Private
const getQuotes = async (req, res, next) => {
  try {
    const { category, status, search, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    if (category) {
      query.category = category;
    }

    if (status) {
      if (status.includes(',')) {
        query.status = { $in: status.split(',').map((s) => s.trim()) };
      } else {
        query.status = status;
      }
    }

    if (search) {
      query.$or = [
        { quote: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Quote.countDocuments(query);

    res.status(200).json({
      success: true,
      count: quotes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quote by ID
// @route   GET /api/quotes/:id
// @access  Private
const getQuoteById = async (req, res, next) => {
  try {
    const quote = await Quote.findOne({ _id: req.params.id, user: req.user._id });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    res.status(200).json({
      success: true,
      quote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quote details or schedule
// @route   PUT /api/quotes/:id
// @access  Private
const updateQuote = async (req, res, next) => {
  try {
    let quote = await Quote.findOne({ _id: req.params.id, user: req.user._id });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      quote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quote
// @route   DELETE /api/quotes/:id
// @access  Private
const deleteQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quote removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate an existing quote
// @route   POST /api/quotes/:id/duplicate
// @access  Private
const duplicateQuote = async (req, res, next) => {
  try {
    const originalQuote = await Quote.findOne({ _id: req.params.id, user: req.user._id });

    if (!originalQuote) {
      return res.status(404).json({
        success: false,
        message: 'Original quote not found',
      });
    }

    const duplicatedData = originalQuote.toObject();
    delete duplicatedData._id;
    delete duplicatedData.createdAt;
    delete duplicatedData.updatedAt;

    duplicatedData.status = 'Pending';
    duplicatedData.scheduledAt = null;
    duplicatedData.postedAt = null;
    duplicatedData.quote = `${duplicatedData.quote} (Copy)`;

    const newQuote = await Quote.create(duplicatedData);

    res.status(201).json({
      success: true,
      quote: newQuote,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQuote,
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
  duplicateQuote,
};
