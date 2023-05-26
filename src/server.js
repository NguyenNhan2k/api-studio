const cors = require('cors');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const path = require('path');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const route = require('./v1/routes');
const { connectDB } = require('./configs/connect_database');
class Server {
    constructor () {
        this.useMiddelwares();
        this.connectDatabase();
        this.listenServer();
        this.initRoute();
        this.setTemplate();
    }
    initRoute () {
        route(app);
    }
    setTemplate (){
        app.use(express.static(path.join(__dirname, 'public')));
        app.engine(
            'hbs',
            handlebars.engine({
                extname: '.hbs',
            }),
        );
        app.set('view engine', 'hbs');
        app.set('views', path.join(__dirname,'v1', 'resources', 'views'));
    }
    useMiddelwares() {
       try {
        app.use(
            session({
                secret: process.env.SECRET_SESSION,
                cookie: { maxAge: 60000 },
            }),
        );
        // override with POST having ?_method=DELETE
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(cors());
        app.use(express.json());
       } catch (error) {
        console.log(error)
       }
    }
    connectDatabase() {
        return connectDB();
    }
    listenServer() {
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`sever listening on port ${port}`);
        });
    }
}
module.export = new Server;