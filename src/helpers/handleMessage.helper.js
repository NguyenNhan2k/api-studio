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
    async active(req, res, urlRedirect = 'back') {
        try {
            await req.flash('toastMsg', this.result);
            await res.redirect(urlRedirect);
        } catch (error) {
            console.log(error);
            await res.redirect(urlRedirect);
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
    pushResult(option) {
        return (this.result = [
            {
                ...this.result[0],
                ...option,
            },
        ]);
    }
    getResult() {
        return this.result;
    }
}
module.exports = ElertMessage;
