class Auth {
    async index (req,res) {
        try{
            res.render('auth/login', {
                layout:'main'
            })
        }catch(error) {
            console.log(error)
        }
    }
}
module.exports = new Auth();