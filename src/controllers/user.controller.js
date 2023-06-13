const { UserService, RoleService } = require('../service');
class UserController {
    async render(req, res) {
        try {
            const { type, column, page } = await req.query;
            const toastMsg = await req.flash('toastMsg')[0];
            const order = type && column ? [column, type] : [];
            const response = await UserService.getAll({ page, order });
            const [result] = await response.getResult();
            res.render('user/user', {
                layout: 'main',
                users: result && result.users,
                countDelete: result.countDelete,
                countPage: result.countPage,
                toastMsg,
            });
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }
    async renderDetail(req, res) {
        try {
            const toastMsg = await req.flash('toastMsg')[0];
            const idUser = await req.params.id;
            const response = await UserService.getOne(idUser);
            console.log(response);
            res.render('user/detail', {
                layout: 'main',
                user: response && response.user,
                toastMsg,
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
