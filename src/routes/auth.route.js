const express = require('express');
const router = express.Router();
const {authController} = require('../controllers');
router.get('/login', authController.index);
module.exports = router;
