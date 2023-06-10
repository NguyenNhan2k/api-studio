const { ElertMessage, hashPassword } = require('../helpers');
const db = require('../models');
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
    async getAll() {
        try {
            const users = await this.findAll();
            return users;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
}
module.exports = new UserService();
