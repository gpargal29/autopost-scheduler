const express = require('express');
const router = express.Router();
const { getSocialAccounts, toggleSocialAccount } = require('../controllers/socialController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSocialAccounts);
router.put('/:id/toggle', toggleSocialAccount);

module.exports = router;
