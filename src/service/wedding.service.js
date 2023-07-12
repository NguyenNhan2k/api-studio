const { ElertMessage } = require('../helpers');
const db = require('../models');
const ModelInstance = require('../core/base.service');
const { removeArrImgInFolder } = require('../helpers');

const Sequelize = require('sequelize');
const op = Sequelize.Op;
class WeddingService {
    constructor() {
        this.response = new ElertMessage('danger', 'Hàng động thất bại', 1);
        this.instance = new ModelInstance(db.Weddings, 'weddings');
    }
    async create({ ...payload }) {
        try {
            const params = await {
                name: payload.name,
                code: payload.code,
                price: payload.price,
                quanlity: payload.quanlity,
                detail: payload.detail,
                id_categories: payload.id_categories,
                id_categoriesWedding: payload.id_categoriesWedding,
            };
            const [wedding, created] = await db.Weddings.findOrCreate({
                where: { code: params.code },
                defaults: params,
            });
            if (!created) {
                await this.response.setToastMsg('danger', 'Mã váy cưới đã tồn tại !', 1);
                return this.response;
            }

            if (Array.isArray(payload.images) && payload.images.length > 0) {
                const getNameImgs = await payload.images.map((img) => {
                    return {
                        name: img.filename,
                        id_target: wedding.id,
                    };
                });
                await db.Images.bulkCreate(getNameImgs, {
                    returning: true,
                    validate: true,
                    individualHooks: true,
                });
            }
            await this.response.setToastMsg('success', 'Tạo thông tin thành công!', 0);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async convertParams(payload) {
        let output = {};
        if (payload) {
            output = {
                name: payload.name,
                code: payload.code,
                price: payload.price,
                detail: payload.detail,
                quanlity: payload.quanlity,
                id_categories: payload.id_categories,
                id_categoriesWedding: payload.id_categoriesWedding,
            };
        }
        return output;
    }
    async update(id, { ...payload }) {
        try {
            const params = await this.convertParams(payload);
            const wedding = await db.Weddings.update(params, { where: { id: id } });
            if (!wedding[0]) {
                await this.response.setToastMsg('danger', 'Cập nhật thất bại!', 1);
                return this.response;
            }
            const getImagesOldForWedding = await db.Images.findAll({ where: { id_target: id }, raw: true });
            if (Array.isArray(payload.images) && payload.images.length > 0) {
                const deletedImgs = await db.Images.destroy({ where: { id_target: id }, force: true });
                await removeArrImgInFolder(getImagesOldForWedding, process.env.PATH_FOLDER_IMGS_WEDDING);
                const getNameImgs = await payload.images.map((img) => {
                    return {
                        name: img.filename,
                        id_target: id,
                    };
                });
                await db.Images.bulkCreate(getNameImgs, {
                    returning: true,
                    validate: true,
                    individualHooks: true,
                });
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
            const wedding = await db.Weddings.destroy({ where: { id: id } });
            if (!wedding) {
                this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);
            await this.response.pushResult(wedding);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async force(id) {
        try {
            const wedding = await db.Weddings.destroy({ where: { id: id }, force: true });
            if (!wedding) {
                this.response.setMsg('Xóa thất bại!');
                return this.response;
            }
            await this.response.setToastMsg('success', 'Xóa thành công!', 0);
            await this.response.pushResult(wedding);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async findOne(queries) {
        try {
            const output = await db.Weddings.findOne(queries);
            if (!output) {
                return false;
            }
            return output.toJSON();
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async getOne(slug) {
        try {
            const queries = await {
                where: { slug: slug },
                include: [
                    {
                        model: db.Categories,
                        as: 'category',
                        attributes: {
                            exclude: ['updatedAt'],
                        },
                    },
                    {
                        model: db.WeddingCategories,
                        as: 'categoryWedding',
                        attributes: {
                            exclude: ['updatedAt'],
                        },
                    },
                    {
                        model: db.Images,
                        as: 'images',
                        attributes: {
                            exclude: ['updatedAt'],
                        },
                    },
                ],
            };
            const wedding = await this.findOne(queries);
            if (!wedding) {
                this.response.setMsg('Không tìm thấy thông tin đồ cưới !');
                return this.response;
            }
            await this.response.pushResult({ wedding });
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async findAll() {
        try {
            const users = await db.Customers.findAll({
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
        const users = await db.Weddings.findAndCountAll({
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
            const colunms = await ['id', 'code', 'name'];
            const filters = await this.filterSearch(colunms, searchQuery);
            const queries = await {
                where: {
                    [op.or]: filters,
                },
                attributes: {
                    exclude: ['updatedAt'],
                },
                include: [
                    {
                        model: db.Categories,
                        as: 'category',
                        attributes: {
                            exclude: ['updatedAt'],
                        },
                    },
                    {
                        model: db.WeddingCategories,
                        as: 'categoryWedding',
                        attributes: {
                            exclude: ['updatedAt'],
                        },
                    },
                ],
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
            const { count, rows } = await db.Weddings.findAndCountAll({
                ...queries,
            });
            const weddings = await this.convertJson(rows);
            const countDeleted = await this.findAndCountAll(false);
            const countPage = await Math.ceil(count / limit);
            if (!rows) {
                return this.response;
            }
            const output = await {
                weddings: weddings,
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
            const retore = await db.Weddings.restore({
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
            const restored = await db.Weddings.destroy({
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
            const restored = await db.Weddings.restore({
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
            const deleted = await db.Weddings.destroy({
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
module.exports = new WeddingService();
