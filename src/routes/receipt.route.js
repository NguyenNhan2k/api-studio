const express = require('express');
const router = express.Router();
const { ReceiptController } = require('../controllers');
const { validation } = require('../middlewares');
router.get('/search/:value', ReceiptController.search);
router.get('/', ReceiptController.render);
router.get('/create', ReceiptController.renderCreate);
router.get('/trash', ReceiptController.renderTrash);
router.get('/:slug', ReceiptController.renderDetail);

router.post('/create', validation, ReceiptController.create);
router.post('/handleAction', ReceiptController.handleAction);
router.delete('/destroy/:id', ReceiptController.destroy);
router.patch('/update/:id', validation, ReceiptController.update);
router.patch('/restore/:id', ReceiptController.restore);

module.exports = router;
