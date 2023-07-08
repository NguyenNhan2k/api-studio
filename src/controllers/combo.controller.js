const { ComboService } = require('../service');
class ComboController {
    async render(req, res) {
        try {
            const search = await req.query.search;
            const { type, column, page } = await req.query;
            const toastMsg = await req.flash('toastMsg')[0];
            const order = type && column ? [column, type] : [];
            const response = await ComboService.getAll({ page, order }, search);
            const [result] = await response.getResult();
            res.render('combo/combo', {
                layout: 'main',
                combos: result && result.combos,
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
            const response = await ComboService.getAll({ page, order }, search);
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
            const response = await ComboService.getAll({ page, order, deleted });
            const [result] = await response.getResult();
            console.log(result);
            res.render('combo/trash', {
                layout: 'main',
                combos: result && result.combos,
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
            const response = await ComboService.getOne(slug);
            const [result] = await response.getResult();
            res.render('combo/detail', {
                layout: 'main',
                combo: response && result.combo,
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
            res.render('combo/create', {
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
        try {
            const response = await ComboService.create(request);
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
            const respone = await ComboService.update(id, request);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);

            return res.redirect('back');
        }
    }
    async destroy(req, res) {
        try {
            const comboId = await req.params.id;
            const respone = await ComboService.destroy(comboId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async restore(req, res) {
        try {
            const comboId = await req.params.id;
            const respone = await ComboService.restore(comboId);
            return respone.active(req, res);
        } catch (error) {
            console.log(error);
            return res.redirect('back');
        }
    }
    async handleAction(req, res) {
        const message = {};
        try {
            const { action, combos } = await req.body;
            switch (action) {
                case 'delete':
                    const resDeleted = await ComboService.destroyMutiple(combos);
                    return resDeleted.active(req, res);
                    break;
                case 'restore':
                    const resRestore = await ComboService.restoreMutiple(combos);
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
module.exports = new ComboController();
