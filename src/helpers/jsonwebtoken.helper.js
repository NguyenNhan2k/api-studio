var jwt = require('jsonwebtoken');

class JsonWebToken {
    constructor(data, secret, option) {
        this.data = data;
        this.secret = secret;
        this.option = option;
        this.token = null;
    }
    signToken() {
        return jwt.sign(this.data, this.secret, this.option);
    }
}

module.exports = JsonWebToken;
