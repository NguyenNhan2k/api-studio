const express = require('express');
const router = express.Router();
const { CategoryController } = require('../controllers');
const { validation } = require('../middlewares');

router.get('/search/:value', CategoryController.search);
router.get('/', CategoryController.render);
router.get('/create', CategoryController.renderCreate);
router.get('/trash', CategoryController.renderTrash);
router.get('/:id', CategoryController.renderDetail);
router.post('/create', validation, CategoryController.create);
router.post('/handleAction', CategoryController.handleAction);
router.delete('/destroy/:id', CategoryController.destroy);
router.patch('/update/:id', validation, CategoryController.update);
router.patch('/restore/:id', CategoryController.restore);

module.exports = router;
