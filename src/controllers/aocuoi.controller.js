class AocuoiController {
    async index(req, res) {
        try {
            res.render('aocuoi/aocuoi', {
                layout: 'main',
            });
        } catch (error) {
            console.log(error);
        }
    }
    async detail(req, res) {
        try {
            res.render('aocuoi/', {
                layout: 'main',
            });
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new AocuoiController();
