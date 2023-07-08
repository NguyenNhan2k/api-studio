const { ElertMessage } = require('../helpers');
const db = require('../models');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
class CategoriesWeddingService {
    constructor() {
        this.response = new ElertMessage('danger', 'Hàng động thất bại', 1);
    }
    async getAllBasic() {
        let response = {
            err: 1,
            type: 'warning',
            message: 'Hành động thất bại!',
        };
        try {
            const weddingCategories = await db.WeddingCategories.findAll({
                attributes: ['value', 'id'],
                raw: true,
            });
            if (weddingCategories.length <= 0) {
                await this.response.setToastMsg('danger', 'Lấy danh sách thất bại!', 1);
                return this.response;
            }
            this.response.pushResult({ weddingCategories });
            return this.response;
        } catch (error) {
            console.log(error);
            return response;
        }
    }
    async create(payload) {
        try {
            const params = await {
                value: payload.lastName,
            };
            const [customers, created] = await db.WeddingCategories.findOrCreate({
                where: params,
                defaults: params,
            });
            if (!created) {
                await this.response.setToastMsg('danger', 'Danh mục đã tồn tại !', 1);
                return this.response;
            }
            await this.response.setToastMsg('success', 'Tạo Danh mục thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return response;
        }
    }
    async convertParams(payload) {
        let output = {};
        if (payload) {
            output = {
                value: payload.value,
            };
        }

        return output;
    }
    async update(id, payload) {
        try {
            const params = await this.convertParams(payload);
            const user = await db.WeddingCategories.update(params, { where: { id: id } });
            if (!user[0]) {
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
            const user = await db.WeddingCategories.destroy({ where: { id: id } });
            if (!user) {
                this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);
            await this.response.pushResult(user);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async force(id) {
        try {
            const user = await db.WeddingCategories.destroy({ where: { id: id }, force: true });
            if (!user) {
                this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);
            await this.response.pushResult(user);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }

    async getOne(id) {
        try {
            let weddingCategory = await db.WeddingCategories.findOne({ where: { id }, raw: true });
            if (!weddingCategory) {
                this.response.setMsg('Không tìm thấy!');
                return this.response;
            }
            await this.response.pushResult({ weddingCategory });
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
        const users = await db.WeddingCategories.findAndCountAll({
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
            const colunms = await ['id', 'value'];
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
            const { count, rows } = await db.WeddingCategories.findAndCountAll({
                ...queries,
            });
            const newcustomers = await this.convertJson(rows);
            const countDeleted = await this.findAndCountAll(false);
            const countPage = await Math.ceil(count / limit);
            if (!rows) {
                return this.response;
            }
            const output = await {
                weddingCategories: newcustomers,
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
            const retore = await db.WeddingCategories.restore({
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
            const restored = await db.WeddingCategories.destroy({
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
            const restored = await db.WeddingCategories.restore({
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
            const deleted = await db.WeddingCategories.destroy({
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
            await this.response.pushResult(user);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
}
module.exports = new CategoriesWeddingService();
