const homeController = require('./home.controller');
const AuthController = require('./auth.controller');
const UserController = require('./user.controller');
const AocuoiController = require('./aocuoi.controller');
const CalendarController = require('./calendar.controller');
module.exports = {
    homeController,
    AuthController,
    UserController: UserController,
    AocuoiController: AocuoiController,
    CalendarController,
};
