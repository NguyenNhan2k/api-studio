const express = require('express');
const router = express.Router();
const { ContractController } = require('../controllers');
const { validation } = require('../middlewares');
router.get('/search/:value', ContractController.search);
router.get('/', ContractController.render);
router.get('/create', ContractController.renderCreate);
router.get('/trash', ContractController.renderTrash);
router.get('/:id', ContractController.renderDetail);

router.post('/create', validation, ContractController.create);
router.post('/handleAction', ContractController.handleAction);
router.delete('/destroy/:id', ContractController.destroy);
router.patch('/update/:id', ContractController.update);
router.patch('/restore/:id', ContractController.restore);
router.delete('/force/:id', ContractController.force);

module.exports = router;
