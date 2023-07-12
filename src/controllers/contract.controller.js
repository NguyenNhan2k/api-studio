const { ContractService } = require('../service');
class ContractController {
    async render(req, res) {
        try {
            const search = await req.query.search;
            const { type, column, page } = await req.query;
            const toastMsg = await req.flash('toastMsg')[0];
            const order = type && column ? [column, type] : [];
            const response = await ContractService.getAll({ page, order }, search);
            const [result] = await response.getResult();
            res.render('contract/contract', {
                layout: 'main',
                contracts: result && result.contracts,
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
            const response = await ContractService.getAll({ page, order }, search);
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
            const response = await ContractService.getAll({ page, order, deleted });
            const [result] = await response.getResult();
            console.log(result);
            res.render('wedding/trash', {
                layout: 'main',
                weddings: result && result.weddings,
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
            const slug = await req.params.slug;
            const response = await ContractService.getOne(slug);
            const resCategories = await CategoriesService.getAllBasic();
            const resCategoriesWedding = await CategoriesContractService.getAllBasic();

            const [result] = await response.getResult();
            const getCategories = await resCategories.getResult();
            const getCategoriesWedding = await resCategoriesWedding.getResult();
            res.render('wedding/detail', {
                layout: 'main',
                wedding: response && result.wedding,
                categories: getCategories[0].categories,
                weddingcategories: getCategoriesWedding[0].weddingCategories,
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
            const resCategoriesWedding = await CategoriesContractService.getAllBasic();
            const getCategories = await resCategories.getResult();
            const getCategoriesWedding = await resCategoriesWedding.getResult();
            res.render('wedding/create', {
                layout: 'main',
                categories: getCategories[0].categories,
                weddingcategories: getCategoriesWedding[0].weddingCategories,
                toastMsg,
            });
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }
    async create(req, res) {
        const request = await req.payload;
        const images = await req.files;
        try {
            if (images) {
                request.images = await images;
            }
            const response = await ContractService.create(request);
            const result = await response.getResult()[0];
            if (result.error === 1) {
                await removeArrImgForController(images);
            }
            return response.active(req, res);
        } catch (error) {
            console.log(error);
            if (images) {
                removeArrImgForController(images);
            }
            return res.redirect('back');
        }
    }
    async update(req, res) {
        const images = await req.files;
        const request = await req.payload;
        const id = await req.params.id;
        try {
            if (images) {
                request.images = await images;
            }
            const respone = await ContractService.update(id, request);
            if (respone.error === 1) {
                await removeArrImgForController(images);
            }
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            if (images) {
                removeArrImgForController(images);
            }
            return res.redirect('back');
        }
    }
    async destroy(req, res) {
        try {
            const weddingId = await req.params.id;
            const respone = await ContractService.destroy(weddingId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async restore(req, res) {
        try {
            const weddingId = await req.params.id;
            const respone = await ContractService.restore(weddingId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async force(req, res) {
        try {
            const weddingId = await req.params.id;
            const respone = await ContractService.destroy(weddingId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async handleAction(req, res) {
        const message = {};
        try {
            const { action, weddings } = await req.body;
            switch (action) {
                case 'delete':
                    const resDeleted = await ContractService.destroyMutiple(weddings);
                    return resDeleted.active(req, res);
                    break;
                case 'restore':
                    const resRestore = await ContractService.restoreMutiple(weddings);
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
module.exports = new ContractController();
