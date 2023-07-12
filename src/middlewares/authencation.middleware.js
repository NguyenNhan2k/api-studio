var jwt = require('jsonwebtoken');
const { ElertMessage } = require('../helpers');
class AuthJwt {
    constructor(token) {
        this.token = token;
    }
    async handdleToken() {
        try {
            this.token = await this.token.split(' ')[1];
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async verifyToken(keySecrect) {
        try {
            return jwt.verify(this.token, keySecrect, async (err, decode) => {
                if (err) {
                    return {
                        err: true,
                        name: err.name,
                        massage: err.message,
                    };
                }
                return {
                    err: 0,
                    user: decode,
                };
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
class AuthJwtMiddleWare {
    async authAccessToken(req, res, next) {
        const message = await {
            type: 'danger',
            message: 'Vui lòng đăng nhập để tiếp tục!',
            err: 1,
        };
        try {
            res.redirect('back');
            return 0;
            const params = await req.cookies.accessToken;
            if (!params) {
                await req.flash('toastMsg', message);
                return res.redirect('back');
            }
            const token = await new AuthJwt(params);
            await token.handdleToken();
            const verifyToken = await token.verifyToken(process.env.SECRECT_KEY_ACCESSTOKEN);
            if (verifyToken.err) {
                await req.flash('toastMsg', message);
                res.redirect('back');
            }
            req.user = await verifyToken;
            return next();
        } catch (error) {
            await req.flash('toastMsg', message);
            res.redirect('back');
        }
    }
}
module.exports = new AuthJwtMiddleWare();
