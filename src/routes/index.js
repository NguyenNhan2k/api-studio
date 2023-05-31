const main = require('./main.js');
const authRoute = require('./auth.route');
const uesrRoute = require('./user.route');
function route(app) {
    app.use('/', main);
    app.use('/v1', authRoute);
    app.use('/user', uesrRoute);
}
module.exports = route;
