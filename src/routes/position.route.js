const express = require('express');
const router = express.Router();
const { PositionController } = require('../controllers');
const { validation } = require('../middlewares');

router.get('/search/:value', PositionController.search);
router.get('/', PositionController.render);
router.get('/create', PositionController.renderCreate);
router.get('/trash', PositionController.renderTrash);
router.get('/:id', PositionController.renderDetail);
router.post('/create', validation, PositionController.create);
router.post('/handleAction', PositionController.handleAction);
router.delete('/destroy/:id', PositionController.destroy);
router.patch('/update/:id', validation, PositionController.update);
router.patch('/restore/:id', PositionController.restore);

module.exports = router;
