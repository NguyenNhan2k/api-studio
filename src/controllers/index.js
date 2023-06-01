const homeController = require('./home.controller');
const authController = require('./auth.controller');
const UserController = require('./user.controller');
const AocuoiController = require('./aocuoi.controller');
module.exports = {
    homeController,
    authController,
    UserController: UserController,
    AocuoiController: AocuoiController,
};
