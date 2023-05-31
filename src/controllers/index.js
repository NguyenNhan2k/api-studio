const homeController = require('./home.controller');
const authController = require('./auth.controller');
const UserController = require('./user.controller');
module.exports = {
    homeController,
    authController,
    UserController: UserController,
};
