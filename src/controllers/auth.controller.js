class Auth {
    async index(req, res) {
        try {
            res.json('test');
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new Auth();
