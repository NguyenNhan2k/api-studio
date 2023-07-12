const joi = require('joi');
const objShema = {
    lastName: joi.string().required().optional(),
    firstName: joi.string().required().optional(),
    phone: joi.string().required().optional(),
    code: joi.string().required().optional(),
    name: joi.string().required().optional(),
    value: joi.string().required().optional(),
    detail: joi.string().required().optional(),
    price: joi.number().required().optional(),
    quanlity: joi.number().required().optional(),
    wage: joi.number().required().optional(),
    id_categories: joi.string().required().optional(),
    id_categoriesWedding: joi.string().required().optional(),
    email: joi.string().required().email().optional(),
    address: joi.string().required().optional(),
    action: joi.string().required().optional(),
    password: joi.string().required().optional(),
    newPassword: joi.string().optional(),
    idRole: joi.string().required().optional(),
    idPosition: joi.string().required().optional(),
    comfirmPwd: joi.ref('password'),
};
module.exports = objShema;
