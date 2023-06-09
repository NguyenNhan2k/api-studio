const joi = require('joi');
const objShema = {
    lastName: joi.string().required(),
    firstName: joi.string().required(),
    phone: joi.string().required(),
    email: joi.string().required().email(),
    address: joi.string().required(),
    password: joi.string().required().max(5),
    comfirmPwd: joi.ref('password'),
};
module.exports = objShema;
