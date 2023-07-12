const { ElertMessage } = require('../helpers');
const db = require('../models');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
class ContractService {
    constructor() {
        this.response = new ElertMessage('danger', 'Hàng động thất bại', 1);
    }
    async create({ ...payload }) {
        try {
            const paramsReceipt = await {
                code: payload.code,
            };
            const [receipt, created] = await db.Receipts.findOrCreate({
                where: { code: paramsReceipt.code },
                defaults: paramsReceipt,
            });
            if (!created) {
                await this.response.setToastMsg('danger', 'Mã phiếu nhập đã tồn tại !', 1);
                return this.response;
            }
            const isCheckArr = (await Array.isArray(payload.id_target)) && payload.id_target.length > 0;
            const paramsDetail =
                (await isCheckArr) &&
                payload.id_target.map((item, index) => {
                    return {
                        id_receipt: receipt.dataValues.id,
                        id_target: payload.id_target[index],
                        quanlity: parseInt(payload.quanlity[index]),
                        price: parseInt(payload.price[index]),
                        total: parseInt(payload.total[index]),
                    };
                });
            let sumTotalReceipt = 0;
            if (Array.isArray(paramsDetail) && paramsDetail.length > 0) {
                const handleArrReceipt = await paramsDetail.map((receipt) => {
                    const total = parseInt(receipt.quanlity) * parseInt(receipt.price);
                    return {
                        ...receipt,
                        total,
                    };
                });
                console.log(handleArrReceipt);
                await db.DetailReceipts.bulkCreate(handleArrReceipt, {
                    returning: true,
                    validate: true,
                    individualHooks: true,
                });
                sumTotalReceipt = await handleArrReceipt.reduce((acc, curr) => {
                    return curr.total + acc;
                }, 0);
            }
            receipt.total = await sumTotalReceipt;
            await receipt.save();
            await this.response.setToastMsg('success', 'Tạo thông tin thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async convertParams(payload) {
        let output = {};
        if (payload) {
            output = {
                name: payload.name,
                code: payload.code,
                price: payload.price,
                id_categories: payload.id_categories,
            };
        }
        return output;
    }
    async update(id, { ...payload }) {
        try {
            const receipt = await db.Receipts.findOne({ where: { id: id } });
            if (!receipt) {
                await this.response.setToastMsg('danger', 'Cập nhật thất bại!', 1);
                return this.response;
            }
            const forced = await db.DetailReceipts.destroy({
                where: {
                    id_receipt: id,
                },
                force: true,
            });
            const paramsDetail = await payload.id_target.map((item, index) => {
                return {
                    id_receipt: receipt.dataValues.id,
                    id_target: payload.id_target[index],
                    quanlity: parseInt(payload.quanlity[index]),
                    price: parseInt(payload.price[index]),
                    total: parseInt(payload.total[index]),
                };
            });
            let sumTotalReceipt = 0;
            if (Array.isArray(paramsDetail) && paramsDetail.length > 0) {
                const handleArrReceipt = await paramsDetail.map((receipt) => {
                    const total = parseInt(receipt.quanlity) * parseInt(receipt.price);
                    return {
                        ...receipt,
                        total,
                    };
                });
                console.log(handleArrReceipt);
                await db.DetailReceipts.bulkCreate(handleArrReceipt, {
                    returning: true,
                    validate: true,
                    individualHooks: true,
                });
                sumTotalReceipt = await handleArrReceipt.reduce((acc, curr) => {
                    return curr.total + acc;
                }, 0);
            }
            receipt.total = await sumTotalReceipt;
            receipt.code = await payload.code;
            await receipt.save();
            await this.response.setToastMsg('success', 'Cập nhật thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async destroy(id) {
        try {
            const receipt = await db.Receipts.destroy({ where: { id: id } });
            if (!receipt) {
                this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            const destroyOfReceipts = await db.DetailReceipts.destroy({ where: { id_receipt: id } });
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async force(id) {
        try {
            const receipt = await db.Receipts.destroy({ where: { id: id }, force: true });
            const forceOfReceipts = await db.DetailReceipts.destroy({ where: { id_receipt: id }, force: true });
            if (!receipt) {
                this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);

            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async getOne(id) {
        try {
            const queries = await {
                where: { id: id },
                include: [
                    {
                        model: db.DetailReceipts,
                        as: 'detailReceipts',
                        attributes: {
                            exclude: ['updatedAt'],
                        },
                        include: [
                            {
                                model: db.Weddings,
                                as: 'wedding',
                                attributes: {
                                    exclude: ['updatedAt'],
                                },
                            },
                            {
                                model: db.Accessories,
                                as: 'accessory',
                                attributes: {
                                    exclude: ['updatedAt'],
                                },
                            },
                        ],
                    },
                ],
                nest: true,
            };
            const receipt = await db.Receipts.findOne(queries);
            if (!receipt) {
                this.response.setMsg('Không tìm thấy thông tin đồ cưới !');
                return this.response;
            }
            const output = await receipt.toJSON();
            const handleReceipt = output.detailReceipts.map((receipt) => {
                if (receipt.wedding) {
                    receipt.name = receipt.wedding.name;
                }
                if (receipt.accessory) {
                    receipt.name = receipt.accessory.name;
                }
                return receipt;
            });
            output.detailReceipts = handleReceipt;
            await this.response.pushResult({ receipt: output });
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async convertJson(payload) {
        try {
            if (Array.isArray(payload) && payload.length > 0) {
                const result = await payload.map((user) => {
                    return user.toJSON();
                });
                return result;
            }
            return false;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async findAndCountAll(deleted = true) {
        const users = await db.Receipts.findAndCountAll({
            where: {
                destroyTime: {
                    [op.not]: null,
                },
            },
            paranoid: false,
            raw: true,
        });
        return users;
    }
    filterSearch(columns, searchQuery) {
        const filter = columns.map((column) => {
            return {
                [column]: { [op.like]: '%' + searchQuery + '%' },
            };
        });
        return filter;
    }
    async getAll({ page, order, deleted = true }, searchQuery = '') {
        try {
            const offset = (await !page) || +page < 1 ? 0 : +page - 1;
            const limit = await process.env.QUERY_LIMIT;
            const colunms = await ['id', 'code'];
            const filters = await this.filterSearch(colunms, searchQuery);
            const queries = await {
                where: {
                    [op.or]: filters,
                },
                attributes: {
                    exclude: ['updatedAt'],
                },
            };
            if (searchQuery) {
                queries.where = await { [op.or]: filters };
            }
            if (order.length > 0) {
                queries.order = await [order];
            }
            if (!deleted) {
                (queries.where = await {
                    destroyTime: {
                        [op.not]: null,
                    },
                }),
                    (queries.paranoid = deleted);
            }
            queries.offset = (await offset) * limit;
            queries.limit = await +limit;
            const { count, rows } = await db.Receipts.findAndCountAll({
                ...queries,
            });
            const receipts = await this.convertJson(rows);
            const countDeleted = await this.findAndCountAll(false);
            const countPage = await Math.ceil(count / limit);
            if (!rows) {
                return this.response;
            }
            const output = await {
                receipts: receipts,
                countDeleted: countDeleted.count,
                countPage,
            };
            await this.response.setToastMsg('success', 'Lấy danh sách thành công!', 0);
            await this.response.pushResult(output);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async restore(id) {
        try {
            const retored = await db.Receipts.restore({
                where: {
                    id,
                },
                raw: true,
                nest: true,
            });
            const retoredForReceipt = await db.DetailReceipts.restore({
                where: {
                    id_receipt: id,
                },
            });
            if (!retored) {
                return this.response;
            }
            await this.response.setToastMsg('success', 'Khôi phục thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async destroyMutiple(arrId) {
        try {
            const destroied = await db.Receipts.destroy({
                where: {
                    id: arrId,
                },
                raw: true,
                nest: true,
            });
            const destroiedForReceipt = await db.DetailReceipts.destroy({
                where: {
                    id_receipt: arrId,
                },
                raw: true,
                nest: true,
            });
            if (!destroied) {
                await this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async restoreMutiple(arrId) {
        try {
            const restored = await db.Receipts.restore({
                where: {
                    id: arrId,
                },
                raw: true,
                nest: true,
            });
            const retoredForReceipt = await db.DetailReceipts.restore({
                where: {
                    id_receipt: arrId,
                },
                raw: true,
                nest: true,
            });
            if (!restored) {
                this.response.setMsg('Khôi phục thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Khôi phục thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async forceMutiple(arrId) {
        try {
            const forced = await db.Receipts.destroy({
                where: {
                    id: arrId,
                },

                force: true,
            });
            const forcedForReceipt = await db.DetailReceipts.destroy({
                where: {
                    id_receipt: arrId,
                },
                force: true,
            });
            if (!forced) {
                this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Cập nhật thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
}
module.exports = new ContractService();
