const express = require('express');
const {
  registerUser,
  authUser,
  allUsers,
} = require('../controllers/userControllers');
// const { protect } = require('../middleWare/authMiddleware');
const { protect } = require('../middleWare/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers);
router.route('/login', authUser).post(authUser);

module.exports = router;
