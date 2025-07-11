const express = require('express');
const { registerUser , authUser, allUsers } = require("../controllers/userControllers");
const { protect } = require('../middleWare/authMiddleware');



const router = express.Router();

router.route('/').post( registerUser).get(protect, allUsers);

router.post('/login', authUser )

// we can write this way also 
// router.route('/').get(allUsers);


module.exports = router;