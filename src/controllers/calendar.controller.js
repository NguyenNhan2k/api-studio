class CalendarController {
    async render(req, res) {
        try {
            res.render('calendar/calendar', {
                layout: 'main',
            });
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }
}
module.exports = new CalendarController();
