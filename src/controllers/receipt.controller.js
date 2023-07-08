const { ReceiptService } = require('../service');
class ReceiptController {
    async render(req, res) {
        try {
            const search = await req.query.search;
            const { type, column, page } = await req.query;
            const toastMsg = await req.flash('toastMsg')[0];
            const order = type && column ? [column, type] : [];
            const response = await ReceiptService.getAll({ page, order }, search);
            const [result] = await response.getResult();
            res.render('receipt/receipt', {
                layout: 'main',
                receipts: result && result.receipts,
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
            const response = await ReceiptService.getAll({ page, order }, search);
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
            const response = await ReceiptService.getAll({ page, order, deleted });
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
            const response = await ReceiptService.getOne(id);
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
            res.render('receipt/create', {
                layout: 'main',

                toastMsg,
            });
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }
    async create(req, res) {
        const request = await req.payload;
        // {
        //     code: maP01,
        //     receiptDetail: [
        //         {
        //             id_target: 1,
        //             quanlity: 2,
        //             price: 100000,
        //         }
        //     ]
        // }

        try {
            const response = await ReceiptService.create(request);
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
            const respone = await ReceiptService.update(id, request);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);

            return res.redirect('back');
        }
    }
    async destroy(req, res) {
        try {
            const weddingId = await req.params.id;
            const respone = await ReceiptService.destroy(weddingId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async restore(req, res) {
        try {
            const weddingId = await req.params.id;
            const respone = await ReceiptService.restore(weddingId);
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
                    const resDeleted = await ReceiptService.destroyMutiple(accessories);
                    return resDeleted.active(req, res);
                    break;
                case 'restore':
                    const resRestore = await ReceiptService.restoreMutiple(accessories);
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
module.exports = new ReceiptController();
