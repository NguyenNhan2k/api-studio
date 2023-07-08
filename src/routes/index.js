const main = require('./main.js');
const authRoute = require('./auth.route');
const receiptRoute = require('./receipt.route');
const uesrRoute = require('./user.route');
const comboRoute = require('./combo.route');
const aocuoiRoute = require('./aocuoi.route');
const weddingRoute = require('./wedding.route');
const customerRoute = require('./customer.route');
const calendarRoute = require('./calendar.route');
const positionRoute = require('./position.route');
const categoryRoute = require('./category.route');
const accessoryRoute = require('./accessory.route');
const weddindCategoryRoute = require('./wedding-categories.route');
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
        this.app.use('/combos', comboRoute);
        this.app.use('/weddings', weddingRoute);
        this.app.use('/receipts', receiptRoute);
        this.app.use('/customers', customerRoute);
        this.app.use('/positions', positionRoute);
        this.app.use('/categories', categoryRoute);
        this.app.use('/accessories', accessoryRoute);
        this.app.use('/wedding-categories', weddindCategoryRoute);
        // this.app.use('/v1', authRoute);
        // this.app.use('/aocuoi', AuthToken.authAccessToken, aocuoiRoute);
        this.app.use('/users', uesrRoute);
        // this.app.use('/calendars', AuthToken.authAccessToken, calendarRoute);
    }
}
module.exports = Route;
