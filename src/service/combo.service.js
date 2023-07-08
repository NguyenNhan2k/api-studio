const { ElertMessage } = require('../helpers');
const db = require('../models');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
class ComboService {
    constructor() {
        this.response = new ElertMessage('danger', 'Hàng động thất bại', 1);
    }
    async create({ ...payload }) {
        try {
            const params = await {
                name: payload.name,
                code: payload.code,
                price: payload.price,
                detail: payload.detail,
            };
            const [combo, created] = await db.Combos.findOrCreate({
                where: { code: params.code },
                defaults: params,
            });
            if (!created) {
                await this.response.setToastMsg('danger', 'Mã dịch vụ đã tồn tại !', 1);
                return this.response;
            }
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
                detail: payload.detail,
            };
        }
        return output;
    }
    async update(id, { ...payload }) {
        try {
            const params = await this.convertParams(payload);
            const combo = await db.Combos.update(params, { where: { id: id } });
            if (!combo[0]) {
                await this.response.setToastMsg('danger', 'Cập nhật thất bại!', 1);
                return this.response;
            }
            await this.response.setToastMsg('success', 'Cập nhật thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async destroy(id) {
        try {
            const accessory = await db.Combos.destroy({ where: { id: id } });
            if (!accessory) {
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
    async force(id) {
        try {
            const accessory = await db.Accessories.destroy({ where: { id: id }, force: true });
            if (!accessory) {
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
    async getOne(slug) {
        try {
            const queries = await {
                where: { slug: slug },
                raw: true,
            };
            const combo = await db.Combos.findOne(queries);
            if (!combo) {
                this.response.setMsg('Không tìm thấy thông tin dịch vụ !');
                return this.response;
            }
            await this.response.pushResult({ combo: combo });
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
        const users = await db.Combos.findAndCountAll({
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
            const colunms = await ['id', 'code', 'name'];
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
            const { count, rows } = await db.Combos.findAndCountAll({
                ...queries,
            });
            const accessories = await this.convertJson(rows);
            const countDeleted = await this.findAndCountAll(false);
            const countPage = await Math.ceil(count / limit);
            if (!rows) {
                return this.response;
            }
            const output = await {
                combos: accessories,
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
            const retore = await db.Combos.restore({
                where: {
                    id,
                },
                raw: true,
                nest: true,
            });
            if (!retore) {
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
            const restored = await db.Combos.destroy({
                where: {
                    id: arrId,
                },
                raw: true,
                nest: true,
            });
            if (!restored) {
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
            const restored = await db.Combos.restore({
                where: {
                    id: arrId,
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
            const deleted = await db.Combos.destroy({
                where: {
                    id: arrId,
                },
                raw: true,
                nest: true,
                force: true,
            });
            if (!deleted) {
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
module.exports = new ComboService();
