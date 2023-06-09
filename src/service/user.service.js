const { ElertMessage, hashPassword } = require('../helpers');
const db = require('../models');
class UserService {
    async create(payload) {
        let response = new ElertMessage('danger', 'Hàng động thất bại', 1);
        try {
            const params = await {
                lastName: payload.lastName,
                firstName: payload.firstName,
                email: payload.email,
                phone: payload.phone,
                address: payload.address,
                password: hashPassword(payload.password),
            };
            const [user, created] = await db.Users.findOrCreate({
                where: { email: params.email },
                defaults: params,
            });
            if (!created) {
                response.setToastMsg('danger', 'Tài khoản đa tồn tại!', 1);
                return response;
            }
            await response.setToastMsg('success', 'Tạo tài khoản thành công!', 0);
            return response;
        } catch (error) {
            console.log(error);
            return response;
        }
    }
}
module.exports = new UserService();
