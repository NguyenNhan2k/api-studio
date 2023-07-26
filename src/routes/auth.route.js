const express = require('express');
const router = express.Router();
const passport = require('passport');
const { AuthController } = require('../controllers');
const { validation } = require('../middlewares');

router.get('/', AuthController.render);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
    '/google/callback',
    (req, res, next) => {
        passport.authenticate('google', async (err, user) => {
            if (user) req.user = user;
            next();
        })(req, res, next);
    },
    AuthController.indexAuthGg,
);
router.post('/login', validation, AuthController.login);
module.exports = router;
