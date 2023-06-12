const { ElertMessage, hashPassword } = require('../helpers');
const db = require('../models');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
class UserService {
    constructor() {
        this.response = new ElertMessage('danger', 'Hàng động thất bại', 1);
    }
    async create(payload) {
        try {
            const params = await {
                lastName: payload.lastName,
                firstName: payload.firstName,
                email: payload.email,
                phone: payload.phone,
                address: payload.address,
                id_role: payload.idRole,
                password: hashPassword(payload.password),
            };
            const [user, created] = await db.Users.findOrCreate({
                where: { email: params.email },
                defaults: params,
            });
            if (!created) {
                this.response.setMsg('Tài khoản đã tồn tại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Tạo tài khoản thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return response;
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
    async getAll({ page, order, deleted = true }) {
        try {
            const offset = (await !page) || +page < 1 ? 0 : +page - 1;
            const limit = await process.env.QUERY_LIMIT;
            const queries = await {
                attributes: {
                    exclude: ['password', 'refresh_token', , 'updatedAt', 'id_role'],
                },
                include: {
                    model: db.Roles,
                    as: 'role',
                    attributes: {
                        exclude: [, 'updatedAt'],
                    },
                },
                raw: true,
                nest: true,
            };
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
            const countDeleted = await this.findAndCountAll(false);
            const countPage = await Math.ceil(count / limit);
            if (!rows) {
                return this.response;
            }
            const output = await {
                users: rows,
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
}
module.exports = new UserService();
