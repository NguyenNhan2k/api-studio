const db = require('../models');
const { ElertMessage, JsonWebToken, matchPwd } = require('../helpers');
class Auth {
    constructor(email, password, isRemember) {
        this.email = email;
        this.password = password;
        this.remember = isRemember;
    }
    async findUser(payload, raw = false) {
        try {
            const queries = {
                where: payload,
                raw: false,
                nest: true,
                include: {
                    model: db.Roles,
                    as: 'role',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            };
            if (raw) {
                queries.raw = raw;
            }
            const user = await db.Users.findOne(queries);
            return user;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async update(payload, query) {
        try {
            const user = await db.Users.update(payload, { where: query });
            return user;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
class AuthService {
    constructor() {
        this.response = new ElertMessage('danger', 'Hàng động thất bại', 1);
        this.user = null;
    }
    async login(payload) {
        try {
            const params = await {
                email: payload.email,
                password: payload.password,
                remember: payload.remember && payload.remember == 'on' ? true : false,
            };
            const userParams = await new Auth(params.email, params.password, params.remember);

            this.user = await userParams.findUser({ email: userParams.email }, true);
            const isUserAlready = await this.user;
            if (!isUserAlready) {
                this.response.setMsg('Tài khoản chưa được đăng ký!');
                return this.response;
            }

            const isMatchPwd = await this.matchPassword(userParams.password, this.user.password);
            if (!isMatchPwd) {
                this.response.setMsg('Mật khẩu không chính xác !');
                return this.response;
            }
            // Tạo AccessToken, refreshToken
            const dataOfToken = await {
                id: this.user.id,
                lastName: this.user.lastName,
                firstName: this.user.firstName,
                role: this.user.role.value,
            };
            const optionOfAccessToken = {
                expiresIn: '7d',
            };
            const optionOfRefreshToken = {
                expiresIn: '7d',
            };

            const accessToken = await new JsonWebToken(
                dataOfToken,
                process.env.SECRECT_KEY_ACCESSTOKEN,
                optionOfAccessToken,
            ).signToken();
            const refreshToken = await new JsonWebToken(
                dataOfToken,
                process.env.SECRECT_KEY_REFRESHTOKEN,
                optionOfRefreshToken,
            ).signToken();

            const updateUser = await userParams.update(
                {
                    refresh_token: refreshToken,
                },
                { email: userParams.email },
            );

            const output = await {
                accessToken,
                refreshToken,
                user: dataOfToken,
            };
            this.response.setToastMsg('success', 'Đăng nhập thành công!', 0);
            this.response.pushResult(output);
            return this.response;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
    async matchPassword(password, hashPassword) {
        try {
            const isChecked = await matchPwd(password, hashPassword);
            return isChecked;
        } catch (error) {
            console.log(error);
            return this.response;
        }
    }
}
module.exports = new AuthService();
