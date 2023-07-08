const express = require('express');
const router = express.Router();
const { WeddingCategoriesController } = require('../controllers');
const { validation } = require('../middlewares');

router.get('/search/:value', WeddingCategoriesController.search);
router.get('/', WeddingCategoriesController.render);
router.get('/create', WeddingCategoriesController.renderCreate);
router.get('/trash', WeddingCategoriesController.renderTrash);
router.get('/:id', WeddingCategoriesController.renderDetail);
router.post('/create', validation, WeddingCategoriesController.create);
router.post('/handleAction', WeddingCategoriesController.handleAction);
router.delete('/destroy/:id', WeddingCategoriesController.destroy);
router.patch('/update/:id', validation, WeddingCategoriesController.update);
router.patch('/restore/:id', WeddingCategoriesController.restore);

module.exports = router;
