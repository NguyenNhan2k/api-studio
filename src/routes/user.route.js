const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
const { validation } = require('../middlewares');
const { uploadFile } = require('../helpers');
const upload = uploadFile('user');
router.get('/search/:value', UserController.search);
router.get('/', UserController.render);
router.get('/trash', UserController.renderTrash);
router.get('/create', UserController.renderCreate);
router.get('/:id', UserController.renderDetail);
router.post('/create', validation, UserController.create);
router.post('/handleAction', UserController.handleAction);
router.delete('/destroy/:id', UserController.destroy);
router.patch('/update/:id', upload.single('avatar'), validation, UserController.update);
router.patch('/restore/:id', UserController.restore);

module.exports = router;
