const db = require('../models');
const { ElertMessage } = require('../helpers');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
class StatusService {
    constructor() {
        this.response = new ElertMessage('danger', 'Hàng động thất bại', 1);
    }
    async getAllBasic() {
        try {
            const status = await db.Statuses.findAll({
                attributes: ['value', 'id'],
                raw: true,
            });
            if (status.length <= 0) {
                await this.response.setToastMsg('danger', 'Lấy danh sách thất bại!', 1);
                return this.response;
            }
            this.response.pushResult({ status });
            return this.response;
        } catch (error) {
            console.log(error);
            return response;
        }
    }
    async create(payload) {
        try {
            const params = await {
                value: payload.value,
            };
            const [status, created] = await db.Statuses.findOrCreate({
                where: { value: params.value },
                defaults: params,
            });
            if (!created) {
                await this.response.setToastMsg('danger', 'Thông tin đã tồn tại !', 1);
                return this.response;
            }
            await this.response.setToastMsg('success', 'Tạo thông tin thành công!', 0);
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
            const status = await db.Statuses.update(params, { where: { id: id } });
            if (!status[0]) {
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
            const status = await db.Statuses.destroy({ where: { id: id } });
            if (!status) {
                this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);
            await this.response.pushResult(status);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async force(id) {
        try {
            const status = await db.Statuses.destroy({ where: { id: id }, force: true });
            if (!status) {
                this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);
            await this.response.pushResult(status);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async getOne(id) {
        try {
            const queries = await {
                where: { id },
                raw: true,
            };
            let status = await db.Statuses.findOne(queries);
            if (!status) {
                this.response.setMsg('Không tìm thấy!');
                return this.response;
            }
            await this.response.pushResult({ status });
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
        const users = await db.Statuses.findAndCountAll({
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
            const { count, rows } = await db.Statuses.findAndCountAll({
                ...queries,
            });
            const newStatus = await this.convertJson(rows);
            const countDeleted = await this.findAndCountAll(false);
            const countPage = await Math.ceil(count / limit);
            if (!rows) {
                return this.response;
            }
            const output = await {
                status: newStatus,
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
            const retore = await db.Statuses.restore({
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
    async force(id) {
        try {
            const retore = await db.Statuses.destroy({
                where: {
                    id,
                },
                raw: true,
                nest: true,
                force: true,
            });
            const contracts = await db.Contracts.destroy({
                where: {
                    id_status: id,
                },
                raw: true,
                nest: true,
                force: true,
            });
            if (!retore) {
                return this.response;
            }
            await this.response.setToastMsg('success', 'Xóa vĩnh viễn thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async destroyMutiple(arrId) {
        try {
            const restored = await db.Statuses.destroy({
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
            const contracts = await db.Contracts.destroy({ where: { id_status: arrId } });
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async restoreMutiple(arrId) {
        try {
            const restored = await db.Statuses.restore({
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
            const contracts = await db.Contracts.restore({
                where: {
                    id_status: arrId,
                },
                raw: true,
            });
            await this.response.setToastMsg('success', 'Khôi phục thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async forceMutiple(arrId) {
        try {
            const deleted = await db.Statuses.destroy({
                where: {
                    id: arrId,
                },
                raw: true,
                nest: true,
                force: true,
            });
            const contracts = await db.Contracts.restore({
                where: {
                    id_status: arrId,
                },
                raw: true,
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
module.exports = new StatusService();
