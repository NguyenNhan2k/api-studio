const { UserService, RoleService } = require('../service');
class UserController {
    async render(req, res) {
        try {
            const response = await UserService.getAll();
            res.render('user/user', {
                layout: 'main',
                users: response && response,
            });
        } catch (error) {
            console.log(error);
            res.redirect('back');
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
            res.redirect('back');
        }
    }
    async create(req, res) {
        try {
            const request = await req.payload;
            const result = await UserService.create(request);
            return result.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
}
module.exports = new UserController();
