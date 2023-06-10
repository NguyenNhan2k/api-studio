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
            await res.redirect('back');
        } catch (error) {
            console.log(error);
        }
    }
    setMsg(msg) {
        this.message = msg;
        this.result[0].message = msg;
    }
    getMsg() {
        return this.message;
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
