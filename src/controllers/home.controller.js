class Home {
    async index (req,res) {
        try{
            res.render('manage', {
                layout:'main'
            })
        }catch(error) {
            console.log(error)
        }
    }
}
module.exports = new Home();