const main = require('./main.js');
const authRoute = require('./auth.route');
const uesrRoute = require('./user.route');
const aocuoiRoute = require('./aocuoi.route');
const calendarRoute = require('./calendar.route');
const { sort, AuthToken } = require('../middlewares');
class Route {
    constructor(app) {
        this.app = app;
        this.useRoute();
    }
    async useRoute() {
        this.app.use(sort);
        this.app.use('/', authRoute);
        this.app.use('/dashboard', main);
        // this.app.use('/v1', authRoute);
        this.app.use('/aocuoi', AuthToken.authAccessToken, aocuoiRoute);
        this.app.use('/users', AuthToken.authAccessToken, uesrRoute);
        this.app.use('/calendars', AuthToken.authAccessToken, calendarRoute);
    }
}
module.exports = Route;
