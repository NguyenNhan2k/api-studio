const { CategoriesWeddingService } = require('../service');
const { removeAvatar } = require('../helpers');
class WeddingCategoriesController {
    async render(req, res) {
        try {
            const search = await req.query.search;
            const { type, column, page } = await req.query;
            const toastMsg = await req.flash('toastMsg')[0];
            const order = type && column ? [column, type] : [];
            const response = await CategoriesWeddingService.getAll({ page, order }, search);
            const [result] = await response.getResult();
            console.log(result);
            res.render('wedding-category/wedding-category', {
                layout: 'main',
                weddingCategories: result && result.weddingCategories,
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
            const response = await CategoriesWeddingService.getAll({ page, order }, search);
            const [result] = await response.getResult();
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
            const response = await CategoriesWeddingService.getAll({ page, order, deleted });
            const [result] = await response.getResult();
            console.log(result);
            res.render('wedding-category/trash', {
                layout: 'main',
                weddingCategories: result && result.weddingCategories,
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
            const idCustomer = await req.params.id;
            const response = await CategoriesWeddingService.getOne(idCustomer);
            const [result] = await response.getResult();
            console.log(result);
            res.render('wedding-category/detail', {
                layout: 'main',
                weddingCategory: response && result.weddingCategory,
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
            res.render('category/create', {
                layout: 'main',
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
            const result = await CategoriesWeddingService.create(request);
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
            const respone = await CategoriesWeddingService.update(id, request);
            return respone.active(req, res);
        } catch (error) {
            (await avatar) && removeAvatar(avatar.path);
            return res.redirect('back');
        }
    }
    async destroy(req, res) {
        try {
            const userId = await req.params.id;
            const respone = await CategoriesWeddingService.destroy(userId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async restore(req, res) {
        try {
            const userId = await req.params.id;
            const respone = await CategoriesWeddingService.restore(userId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async handleAction(req, res) {
        const message = {};
        try {
            const { action, weddingCategories } = await req.body;
            switch (action) {
                case 'delete':
                    const resDeleted = await CategoriesWeddingService.destroyMutiple(weddingCategories);
                    return resDeleted.active(req, res);
                    break;
                case 'restore':
                    const resRestore = await CategoriesWeddingService.restoreMutiple(weddingCategories);
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
module.exports = new WeddingCategoriesController();
