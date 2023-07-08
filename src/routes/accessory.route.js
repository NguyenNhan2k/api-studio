const express = require('express');
const router = express.Router();
const { AccessoryController } = require('../controllers');
const { validation } = require('../middlewares');
router.get('/search/:value', AccessoryController.search);
router.get('/create', AccessoryController.renderCreate);
router.get('/trash', AccessoryController.renderTrash);
router.get('/:id', AccessoryController.renderDetail);
router.get('/', AccessoryController.render);

router.post('/create', validation, AccessoryController.create);
router.post('/handleAction', AccessoryController.handleAction);
router.delete('/destroy/:id', AccessoryController.destroy);
router.patch('/update/:id', validation, AccessoryController.update);
router.patch('/restore/:id', AccessoryController.restore);

module.exports = router;
