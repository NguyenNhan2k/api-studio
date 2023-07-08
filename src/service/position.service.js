const db = require('../models');
const { ElertMessage } = require('../helpers');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
class PositionService {
    constructor() {
        this.response = new ElertMessage('danger', 'Hàng động thất bại', 1);
    }
    async convertJson(payload) {
        try {
            if (Array.isArray(payload) && payload.length > 0) {
                const result = await payload.map((item) => {
                    return item.toJSON();
                });
                return result;
            }
            return false;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async render({ page, order, deleted = true }, searchQuery = '') {
        try {
            const offset = (await !page) || +page < 1 ? 0 : +page - 1;
            const limit = await process.env.QUERY_LIMIT;
            const colunms = await ['id', 'code', 'value'];
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
            const { count, rows } = await db.Positions.findAndCountAll({
                ...queries,
            });
            const newPositions = await this.convertJson(rows);
            const countDeleted = await this.findAndCountAll(false);
            const countPage = await Math.ceil(count / limit);
            if (!rows) {
                return this.response;
            }
            const output = await {
                positions: newPositions,
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
        const users = await db.Positions.findAndCountAll({
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
    async getAll() {
        try {
            const positions = await db.Positions.findAll({
                attributes: ['value', 'id'],
                include: {
                    model: db.Users,
                    as: 'users',
                    attributes: {
                        exclude: ['updatedAt'],
                    },
                },
            });
            const newPositions = await this.convertJson(positions);
            await this.response.setToastMsg('success', 'Lấy danh sách thành công!', 0);
            await this.response.pushResult({ positions: newPositions });
            return this.response;
        } catch (error) {
            console.log(error);
            return response;
        }
    }
    async create(payload) {
        try {
            const params = await {
                code: payload.code,
                value: payload.value,
            };
            console.log(params);
            const [positions, created] = await db.Positions.findOrCreate({
                where: { code: params.code },
                defaults: params,
            });
            if (!created) {
                await this.response.setToastMsg('danger', 'Mã chức vụ đã tồn tại !', 1);
                return this.response;
            }
            await this.response.setToastMsg('success', 'Tạo thông tin chức vụ thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return response;
        }
    }
    async update(id, payload) {
        try {
            const params = await this.convertParams(payload);
            const position = await db.Positions.update(params, { where: { id: id } });
            if (!position[0]) {
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
            const position = await db.Positions.destroy({ where: { id: id } });
            if (!position) {
                this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);
            await this.response.pushResult(position);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async restore(id) {
        try {
            const retore = await db.Positions.restore({
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
            const restored = await db.Positions.destroy({
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
            const restored = await db.Positions.restore({
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
            const deleted = await db.Positions.destroy({
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
module.exports = new PositionService();
