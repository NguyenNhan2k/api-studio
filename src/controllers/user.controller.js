const { UserService, RoleService, PositionService } = require('../service');
const { removeAvatar } = require('../helpers');
class UserController {
    async render(req, res) {
        try {
            const search = await req.query.search;
            const { type, column, page } = await req.query;
            const toastMsg = await req.flash('toastMsg')[0];
            const order = type && column ? [column, type] : [];
            const response = await UserService.getAll({ page, order }, search);
            const [result] = await response.getResult();
            res.render('user/user', {
                layout: 'main',
                users: result && result.users,
                countDeleted: result.countDeleted,
                countPage: result.countPage,
                toastMsg,
            });
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }
    async search(req, res) {
        try {
            const search = await req.params.value;
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await UserService.getAll({ page, order }, search);
            const [result] = await response.getResult();
            console.log(result);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.json(error);
        }
    }
    async renderTrash(req, res) {
        try {
            const { type, column, page } = await req.query;
            const toastMsg = await req.flash('toastMsg')[0];
            const order = (await type) && column ? [column, type] : [];
            const deleted = await false;
            const response = await UserService.getAll({ page, order, deleted });
            const [result] = await response.getResult();
            console.log(result);
            res.render('user/trash', {
                layout: 'main',
                users: result && result.users,
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
            const roles = await RoleService.getAll();
            const positions = await PositionService.getAll();
            const [result] = await response.getResult();
            res.render('user/detail', {
                layout: 'main',
                user: response && result.user,
                roles: roles.roles,
                positions: positions.positions,
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
            const responsePositions = await PositionService.getAll();
            const resultPositions = await responsePositions.getResult();
            res.render('user/create', {
                layout: 'main',
                roles: respone.roles,
                positions: resultPositions[0].positions,
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
    async update(req, res) {
        let avatar = await req.file;
        try {
            const id = await req.params.id;
            const request = await req.payload;
            if (avatar) {
                request.avatar = await avatar.filename;
            }
            if (!id) {
                (await avatar) && removeAvatar(avatar.path);
            }
            const respone = await UserService.update(id, request);
            if (respone.error == 1) {
                (await avatar) && removeAvatar(avatar.path);
            }
            return respone.active(req, res);
        } catch (error) {
            (await avatar) && removeAvatar(avatar.path);
            return res.redirect('back');
        }
    }
    async destroy(req, res) {
        try {
            const userId = await req.params.id;
            const respone = await UserService.destroy(userId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async restore(req, res) {
        try {
            const userId = await req.params.id;
            const respone = await UserService.restore(userId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async handleAction(req, res) {
        const message = {};
        try {
            const { action, users } = await req.body;
            switch (action) {
                case 'delete':
                    const resDeleted = await UserService.destroyMutiple(users);
                    return resDeleted.active(req, res);
                    break;
                case 'restore':
                    const resRestore = await UserService.restoreMutiple(users);
                    return resRestore.active(req, res);
                    break;
                    defaults: message.mes = 'Action invalid !';
            }
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
}
module.exports = new UserController();
