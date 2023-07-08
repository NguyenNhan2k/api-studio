const express = require('express');
const router = express.Router();
const { CustomerController } = require('../controllers');
const { validation } = require('../middlewares');

router.get('/search/:value', CustomerController.search);
router.get('/', CustomerController.render);
router.get('/create', CustomerController.renderCreate);
router.get('/trash', CustomerController.renderTrash);
router.get('/:id', CustomerController.renderDetail);
router.post('/create', validation, CustomerController.create);
router.post('/handleAction', CustomerController.handleAction);
router.delete('/destroy/:id', CustomerController.destroy);
router.patch('/update/:id', validation, CustomerController.update);
router.patch('/restore/:id', CustomerController.restore);

module.exports = router;
