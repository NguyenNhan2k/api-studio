const main = require('./main.js');
const authRoute = require('./auth.route');
const uesrRoute = require('./user.route');
const aocuoiRoute = require('./aocuoi.route');
class Route {
    constructor(app) {
        this.app = app;
        this.useRoute();
    }
    async useRoute() {
        this.app.use('/', main);
        this.app.use('/v1', authRoute);
        this.app.use('/aocuoi', aocuoiRoute);
        this.app.use('/users', uesrRoute);
    }
}
module.exports = Route;
