const UserService = require('../service');
class UserController {
    async render(req, res) {
        try {
            res.render('user/user', {
                layout: 'main',
            });
        } catch (error) {
            console.log(error);
        }
    }
    async renderCreate(req, res) {
        try {
            res.render('user/create', {
                layout: 'main',
            });
        } catch (error) {
            console.log(error);
        }
    }
    async create(req, res) {
        try {
            const request = await req.body;
            res.json(request);
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new UserController();
