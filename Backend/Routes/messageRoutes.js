const express = require("express");
const { protect }= require('../middleWare/authMiddleware');
const { sendMessage , allMessages} = require('../controllers/messageController');

const router = express.Router();

router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect, allMessages);

module.exports = router;