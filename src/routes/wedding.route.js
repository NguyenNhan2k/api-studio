const express = require('express');
const router = express.Router();
const { WeddingController } = require('../controllers');
const { validation } = require('../middlewares');
const { uploadFile } = require('../helpers');
const upload = uploadFile('weddings');
router.get('/search/:value', WeddingController.search);
router.get('/', WeddingController.render);
router.get('/create', WeddingController.renderCreate);
router.get('/trash', WeddingController.renderTrash);
router.get('/:slug', WeddingController.renderDetail);

router.post('/create', upload.array('images'), validation, WeddingController.create);
router.post('/handleAction', WeddingController.handleAction);
router.delete('/destroy/:id', WeddingController.destroy);
router.patch('/update/:id', upload.array('images'), validation, WeddingController.update);
router.patch('/restore/:id', WeddingController.restore);

module.exports = router;
