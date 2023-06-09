const { UserService, RoleService } = require('../service');
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
            const toastMsg = await req.flash('toastMsg')[0];
            const respone = await RoleService.getAll();
            res.render('user/create', {
                layout: 'main',
                roles: respone.roles,
                toastMsg,
            });
        } catch (error) {
            console.log(error);
        }
    }
    async create(req, res) {
        try {
            const request = await req.payload;
            const result = await UserService.create(request);
            console.log(result);
            await result.active(req, res);
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new UserController();
