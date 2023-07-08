const { AccessoryService, CategoriesService } = require('../service');
class AccessoryController {
    async render(req, res) {
        try {
            const search = await req.query.search;
            const { type, column, page } = await req.query;
            const toastMsg = await req.flash('toastMsg')[0];
            const order = type && column ? [column, type] : [];
            const response = await AccessoryService.getAll({ page, order }, search);
            const [result] = await response.getResult();
            res.render('accessory/accessory', {
                layout: 'main',
                accessories: result && result.accessories,
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
            const response = await AccessoryService.getAll({ page, order }, search);
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
            const response = await AccessoryService.getAll({ page, order, deleted });
            const [result] = await response.getResult();
            console.log(result);
            res.render('accessory/trash', {
                layout: 'main',
                accessories: result && result.accessories,
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
            const id = await req.params.id;
            const response = await AccessoryService.getOne(id);
            const resCategories = await CategoriesService.getAllBasic();
            const [result] = await response.getResult();
            const getCategories = await resCategories.getResult();
            res.render('accessory/detail', {
                layout: 'main',
                accessory: response && result.accessory,
                categories: getCategories[0].categories,
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
            const resCategories = await CategoriesService.getAllBasic();
            const getCategories = await resCategories.getResult();
            res.render('accessory/create', {
                layout: 'main',
                categories: getCategories[0].categories,
                toastMsg,
            });
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }
    async create(req, res) {
        const request = await req.payload;
        try {
            const response = await AccessoryService.create(request);
            const result = await response.getResult()[0];
            return response.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async update(req, res) {
        const request = await req.payload;
        const id = await req.params.id;
        try {
            const respone = await AccessoryService.update(id, request);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);

            return res.redirect('back');
        }
    }
    async destroy(req, res) {
        try {
            const weddingId = await req.params.id;
            const respone = await AccessoryService.destroy(weddingId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async restore(req, res) {
        try {
            const weddingId = await req.params.id;
            const respone = await AccessoryService.restore(weddingId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async handleAction(req, res) {
        const message = {};
        try {
            const { action, accessories } = await req.body;
            switch (action) {
                case 'delete':
                    const resDeleted = await AccessoryService.destroyMutiple(accessories);
                    return resDeleted.active(req, res);
                    break;
                case 'restore':
                    const resRestore = await AccessoryService.restoreMutiple(accessories);
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
module.exports = new AccessoryController();
