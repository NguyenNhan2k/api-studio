const joi = require('joi');
const objShema = {
    lastName: joi.string().required().optional(),
    firstName: joi.string().required().optional(),
    phone: joi.string().required().optional(),
    email: joi.string().required().email().optional(),
    address: joi.string().required().optional(),
    password: joi.string().required().optional(),
    comfirmPwd: joi.ref('password'),
    remember: joi.string().optional(),
};
module.exports = objShema;
