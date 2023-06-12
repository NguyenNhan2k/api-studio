const express = require('express');
const router = express.Router();
const { CalendarController } = require('../controllers');

router.get('/', CalendarController.render);

module.exports = router;
