const { ElertMessage, hashPassword } = require('../helpers');
const db = require('../models');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const ModelInstance = require('../core/base.service');
class UserService {
    constructor() {
        this.response = new ElertMessage('danger', 'Hàng động thất bại', 1);
        this.instance = new ModelInstance(db.Users);
    }
    async create(payload) {
        try {
            const params = await {
                lastName: payload.lastName,
                firstName: payload.firstName,
                email: payload.email,
                phone: payload.phone,
                address: payload.address,
                wage: payload.wage,
                id_role: payload.idRole,
                id_position: payload.idPosition,
                password: hashPassword(payload.password),
            };
            const [user, created] = await db.Users.findOrCreate({
                where: { email: params.email },
                defaults: params,
            });
            if (!created) {
                await this.response.setToastMsg('danger', 'Tài khoản đã tồn tại !', 1);
                return this.response;
            }
            await this.response.setToastMsg('success', 'Tạo tài khoản thành công!', 0);
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
                lastName: payload.lastName,
                firstName: payload.firstName,
                email: payload.email,
                phone: payload.phone,
                avatar: payload.avatar,
                address: payload.address,
                wage: payload.wage,
                id_role: payload.idRole,
                id_position: payload.idPosition,
                ...(payload.avatar ? { avatar: payload.avatar } : {}),
            };
        }

        return output;
    }
    async update(id, payload) {
        try {
            const params = await this.convertParams(payload);
            const response = await this.instance.update(params, { where: { id: id } });
            return response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async destroy(id) {
        try {
            const user = await db.Users.destroy({ where: { id: id } });
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
            const user = await db.Users.destroy({ where: { id: id }, force: true });
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
    async findOne(queries) {
        try {
            const user = await db.Users.findOne(queries);
            if (!user) {
                return false;
            }
            return user.toJSON();
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async getOne(id) {
        try {
            const queries = await {
                where: { id: id },
                include: [
                    {
                        model: db.Roles,
                        as: 'role',
                        attributes: {
                            exclude: ['updatedAt'],
                        },
                    },
                    {
                        model: db.Positions,
                        as: 'position',
                        attributes: {
                            exclude: ['updatedAt'],
                        },
                    },
                ],
                nest: true,
            };
            let user = await this.findOne(queries);
            if (!user) {
                this.response.setMsg('Không tìm thấy người dùng!');
                return this.response;
            }

            await this.response.pushResult({ user });
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async findAll() {
        try {
            const users = await db.Users.findAll({
                include: {
                    model: db.Roles,
                    as: 'role',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
                raw: true,
                nest: true,
            });
            return users;
        } catch (error) {
            console.log(error);
            return false;
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
        const users = await db.Users.findAndCountAll({
            where: {
                destroyTime: {
                    [op.not]: null,
                },
            },
            attributes: {
                exclude: ['password', 'refresh_token', 'createdAt'],
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
            const colunms = await ['id', 'lastName', 'firstName', 'email', 'phone'];
            const filters = await this.filterSearch(colunms, searchQuery);
            const limit = await process.env.QUERY_LIMIT;
            const queries = await {
                attributes: {
                    exclude: ['password', 'refresh_token', , 'updatedAt'],
                },
                include: [
                    {
                        model: db.Roles,
                        as: 'role',
                        attributes: {
                            exclude: ['updatedAt'],
                        },
                    },
                    {
                        model: db.Positions,
                        as: 'position',
                        attributes: {
                            exclude: ['updatedAt'],
                        },
                    },
                ],
                nest: true,
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
            const { count, rows } = await db.Users.findAndCountAll({
                ...queries,
            });
            const newUsers = await this.convertJson(rows);
            const countDeleted = await this.findAndCountAll(false);
            const countPage = await Math.ceil(count / limit);
            if (!rows) {
                return this.response;
            }
            const output = await {
                users: newUsers,
                countPage,
                countDeleted: countDeleted.count,
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
            const retore = await db.Users.restore({
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
            const restoreUser = await db.Users.destroy({
                where: {
                    id: arrId,
                },
                raw: true,
                nest: true,
            });
            console.log(restoreUser);
            if (!restoreUser) {
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
            const restored = await db.Users.restore({
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
            const deleted = await db.Users.destroy({
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
module.exports = new UserService();
