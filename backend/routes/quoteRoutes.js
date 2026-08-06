const express = require('express');
const router = express.Router();
const {
  generateQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
  duplicateQuote,
} = require('../controllers/quoteController');
const { protect } = require('../middleware/authMiddleware');

// Protect all quote routes
router.use(protect);

router.post('/generate', generateQuote);
router.route('/').get(getQuotes);
router
  .route('/:id')
  .get(getQuoteById)
  .put(updateQuote)
  .delete(deleteQuote);
router.post('/:id/duplicate', duplicateQuote);

module.exports = router;
