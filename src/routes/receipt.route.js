const express = require('express');
const router = express.Router();
const { ReceiptController } = require('../controllers');
const { validation } = require('../middlewares');
router.get('/search/:value', ReceiptController.search);
router.get('/', ReceiptController.render);
router.get('/create', ReceiptController.renderCreate);
router.get('/trash', ReceiptController.renderTrash);
router.get('/:id', ReceiptController.renderDetail);

router.post('/create', ReceiptController.create);
router.post('/handleAction', ReceiptController.handleAction);
router.delete('/destroy/:id', ReceiptController.destroy);
router.patch('/update/:id', ReceiptController.update);
router.patch('/restore/:id', ReceiptController.restore);
router.delete('/force/:id', ReceiptController.force);

module.exports = router;
