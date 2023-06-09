const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
const { validation } = require('../middlewares');

router.get('/', UserController.render);
router.get('/create', UserController.renderCreate);
router.post('/create', validation, UserController.create);
module.exports = router;
