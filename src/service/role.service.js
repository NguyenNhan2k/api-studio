const db = require('../models');
class RoleService {
    async findAll() {
        let response = {
            err: 1,
            type: 'warning',
            message: 'Hành động thất bại!',
        };
        try {
            const roles = await db.Roles.findAll({
                attributes: ['value', 'id'],
                raw: true,
            });
            return (response = {
                err: 0,
                type: 'success',
                message: 'Hành động thành công!',
                roles,
            });
        } catch (error) {
            console.log(error);
            return response;
        }
    }
    async getAll() {
        let response = {
            err: 1,
            type: 'warning',
            message: 'Hành động thất bại!',
        };
        try {
            const getRoles = await this.findAll();
            if (getRoles.err === 1) {
                return response;
            }
            return (response = {
                err: 0,
                type: 'success',
                roles: getRoles.roles,
            });
        } catch (error) {
            console.log(error);
            return response;
        }
    }
}
module.exports = new RoleService();
