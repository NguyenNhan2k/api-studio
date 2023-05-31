const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
router.get('/', UserController.render);
router.get('/create', UserController.renderCreate);
router.post('/create', UserController.create);
module.exports = router;
