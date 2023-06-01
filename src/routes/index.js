const main = require('./main.js');
const authRoute = require('./auth.route');
const uesrRoute = require('./user.route');
const aocuoiRoute = require('./aocuoi.route');
function route(app) {
    app.use('/', main);
    app.use('/v1', authRoute);
    app.use('/aocuoi', aocuoiRoute);
    app.use('/user', uesrRoute);
}
module.exports = route;
