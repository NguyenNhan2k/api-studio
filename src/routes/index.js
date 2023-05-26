
const main = require('./main.js');
const authRoute = require('./auth.route');
function route(app) {
    app.use('/', main);
    app.use('/v1', authRoute);
}
module.exports = route;
