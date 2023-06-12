const { AuthService } = require('../service');
class AuthController {
    constructor() {
        this.toastMsg = null;
    }
    async render(req, res) {
        try {
            const toastMsg = await req.flash('toastMsg')[0];
            res.render('auth/login', {
                layout: 'login',
                toastMsg,
            });
        } catch (error) {
            console.log(error);
        }
    }
    async login(req, res) {
        try {
            const params = await req.payload;
            const respones = await AuthService.login(params);
            console.log(respones);
            if (respones.error === 1) {
                return respones.active(req, res);
            }
            const { accessToken, refreshToken, user } = await respones.result[0];
            const optionCookie = await {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: true,
                secure: true,
            };
            res.cookie('accessToken', 'Bearer ' + accessToken, optionCookie);
            res.cookie('refreshToken', 'Bearer ' + refreshToken, optionCookie);
            return respones.active(req, res, '/users');
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new AuthController();
