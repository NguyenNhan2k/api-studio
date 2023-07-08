const { ElertMessage } = require('../helpers');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
class ModelInstance {
    constructor(model, name) {
        this.model = model;
        this.name = name;
        this.response = new ElertMessage('danger', 'Hàng động thất bại', 1);
    }
    async update(payload, queries) {
        try {
            const user = await this.model.update(payload, queries);
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
    async create(payload, queries) {
        try {
            const [user, created] = await this.model.findOrCreate({
                where: queries,
                defaults: payload,
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
    async getAll(queries) {
        try {
            const { count, rows } = await this.model.findAndCountAll({
                ...queries,
            });
            const newValue = (await count) ? this.convertJson(rows) : rows;
            const countDeleted = await this.findAndCountAll(false);
            const countPage = await Math.ceil(count / queries.limit);
            if (!rows) {
                return this.response;
            }
            const output = await {
                [this.name]: newValue,
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
    async findAndCountAll(deleted = true) {
        const result = await this.model.findAndCountAll({
            where: {
                destroyTime: {
                    [op.not]: null,
                },
            },
            paranoid: false,
            raw: true,
        });
        return result;
    }
}
module.exports = ModelInstance;
