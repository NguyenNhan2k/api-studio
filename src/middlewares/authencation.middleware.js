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
                // if (err.name === 'TokenExpiredError' && err.message === 'jwt expired') {
                //     console.log('token het han');
                //     const body = { refreshToken: newRefreshToken };
                //     const response = await fetch('http://localhost:8000/auth/v1/refresh-token', {
                //         method: 'post',
                //         body: JSON.stringify(body),
                //         headers: { 'Content-Type': 'application/json' },
                //     });
                //     const data = await response.json();
                //     console.log(data);
                // }
                if (err) {
                    return {
                        err: true,
                        name: err.name,
                        massage: err.message,
                    };
                }
                return decode;
            });
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
class AuthJwtMiddleWare {
    async authAccessToken(req, res, next) {
        const message = new ElertMessage('danger', 'Vui lòng đăng nhập để tiếp tục!', 1);
        try {
            const params = await req.cookies.accessToken;
            if (!params) {
                return message.active(req, res);
            }
            const token = await new AuthJwt(params);
            await token.handdleToken();
            const verifyToken = await token.verifyToken(process.env.SECRECT_KEY_ACCESSTOKEN);
            if (verifyToken.err) {
                return message.active(req, res);
            }
            return next();
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new AuthJwtMiddleWare();
