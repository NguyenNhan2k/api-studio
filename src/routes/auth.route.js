const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers');
const { validation } = require('../middlewares');

router.get('/', AuthController.render);
router.post('/login', validation, AuthController.login);
module.exports = router;
