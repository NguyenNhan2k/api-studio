const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models');
module.exports = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.URL_CALLBACK_GOOGLE,
    },
    async function (accessToken, refreshToken, profile, cb) {
        try {
            const { id, displayName, emails, provider } = await profile;
            const user = await db.Users.findOne({
                where: { email: emails[0].value },
                raw: true,
            });
            return cb(null, user);
        } catch (error) {
            console.log(error);
            return error;
        }
    },
);
