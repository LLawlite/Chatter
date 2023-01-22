const express = require('express');
const {
  allMessages,
  sendMessage,
} = require('../controllers/messageControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// fetch all messages for a paritcular chat
router.route('/:chatId').get(protect, allMessages);

router.route('/').post(protect, sendMessage);

module.exports = router;
