class ElertMessage {
    constructor(type, message, error) {
        this.type = type;
        this.message = message;
        this.error = error;
        this.result = [
            {
                type,
                error,
                message,
            },
        ];
    }
    async active(req, res) {
        try {
            await req.flash('toastMsg', this.result);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    setToastMsg(type, message, error) {
        this.type = type;
        this.message = message;
        this.error = error;
        this.result = [
            {
                type,
                error,
                message,
            },
        ];
    }
    getResult() {
        return this.result;
    }
}
module.exports = ElertMessage;
