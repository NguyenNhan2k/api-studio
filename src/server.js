const cors = require('cors');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const path = require('path');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
// const route = require('./routes/index');
const Route = require('./routes/index');
const { connectDB } = require('./config/connect_database');
const { handlebar } = require('./helpers');
class Server {
    constructor() {
        this.useMiddelwares();
        this.connectDatabase();
        this.listenServer();
        this.initRoute();
        this.setTemplate();
    }
    initRoute() {
        new Route(app);
    }
    setTemplate() {
        app.use(express.static(path.join(__dirname, 'public')));
        app.engine(
            'hbs',
            handlebars.engine({
                extname: '.hbs',
                helpers: { ...handlebar },
            }),
        );
        app.set('view engine', 'hbs');
        app.set('views', path.join(__dirname, 'resources', 'views'));
    }
    useMiddelwares() {
        try {
            app.use(flash());
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
            console.log(error);
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
module.export = new Server();
