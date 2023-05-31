const { response } = require('express');
const db = require('../models');
class UserService {
    constructor() {
        this.create = this.create.bind(this);
    }
    async create(payload) {
        let response = {
            err: 1,
            type: 'warning',
            message: 'Hành động thất bại!',
        };
        try {
            const { email } = await payload;
            const [user, created] = await db.Users.findOrCreate({
                where: { email: email },
                defaults: {
                    payload,
                },
            });
            if (!created) {
                response.message = await `Tài khoản tồn tại!`;
                return response;
            }
            return (response = {
                err: 0,
                type: 'success',
                message: 'Thêm tài khoản thành công!',
            });
        } catch (error) {
            return response;
        }
    }
}
module.exports = UserService;
