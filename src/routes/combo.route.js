const express = require('express');
const router = express.Router();
const { ComboController } = require('../controllers');
const { validation } = require('../middlewares');
const { uploadFile } = require('../helpers');
const upload = uploadFile('weddings');
router.get('/search/:value', ComboController.search);
router.get('/', ComboController.render);
router.get('/create', ComboController.renderCreate);
router.get('/trash', ComboController.renderTrash);
router.get('/:slug', ComboController.renderDetail);

router.post('/create', validation, ComboController.create);
router.post('/handleAction', ComboController.handleAction);
router.delete('/destroy/:id', ComboController.destroy);
router.patch('/update/:id', validation, ComboController.update);
router.patch('/restore/:id', ComboController.restore);

module.exports = router;
