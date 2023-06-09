const joi = require('joi');
const { objShema, ElertMessage } = require('../helpers');
const validation = async (req, res, next) => {
    try {
        const params = await req.body;
        const shema = await joi
            .object()
            .keys({
                ...objShema,
            })
            .unknown(true);

        const { error, value } = await shema.validate(params);
        if (error) {
            const message = await error.details[0].message;
            await new ElertMessage('danger', message, true).active(req, res);
        }
        req.payload = await value;
        next();
    } catch (error) {
        console.log(error.message);
        res.redirect('back');
    }
};
module.exports = validation;
