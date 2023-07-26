const express = require('express');
const router = express.Router();
const { StatusController } = require('../controllers');
const { validation } = require('../middlewares');

router.get('/search/:value', StatusController.search);
router.get('/', StatusController.render);
router.get('/create', StatusController.renderCreate);
router.get('/getAll', StatusController.getAll);
router.get('/trash', StatusController.renderTrash);
router.get('/:id', StatusController.renderDetail);

router.post('/create', validation, StatusController.create);
router.post('/handleAction', StatusController.handleAction);

router.delete('/destroy/:id', StatusController.destroy);
router.delete('/force/:id', StatusController.force);

router.patch('/update/:id', validation, StatusController.update);
router.patch('/restore/:id', StatusController.restore);

module.exports = router;
