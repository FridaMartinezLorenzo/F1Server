"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./database"));
const emailAccess = require('./emailAccess');
const emailOffer = require('./emailOffer');
const fs_1 = __importDefault(require("fs"));
class Server {
    constructor() {
        this.queryUsuario = (decodificado) => {
            return new Promise((resolve, reject) => {
                let consulta = 'SELECT * FROM users WHERE email ="' + decodificado + '"';
                database_1.default.query(consulta, (error, results) => {
                    if (error)
                        return reject(error);
                    return resolve(results);
                });
            });
        };
        dotenv_1.default.config();
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.app.use(express_1.default.static(__dirname + "/Images"));
    }
    config() {
        this.app.use(express_1.default.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: false }));
        this.app.use(express_1.default.json({ limit: '50mb' }));
        this.app.set('port', process.env.PORT || 3001);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        ///////////////////image/////////////
        this.app.post('/uploadImagen', (req, res) => {
            const file = req.body.src;
            const name = req.body.tipo;
            const id = req.body.id;
            const binaryData = Buffer.from(file.replace(/^data:image\/[a-z]+;base64,/, ""), 'base64').toString('binary');
            fs_1.default.writeFile(`${__dirname}/Images/` + name + '/' + id + '.jpg', binaryData, "binary", (err) => {
                console.log(err);
            });
            res.json({ fileName: id + '.jpg' });
        });
        /////////////////mail////////
        this.app.post('/sendEmailResetPassword', (req, res) => {
            const tempres = emailAccess(req.body);
            if (tempres.Success == 0) {
                return res.json({ message: 'Error sending email', status: 500 });
            }
            else {
                res.json({ message: 'Email sent successfully!', status: 200 });
            }
        });
        this.app.post('/decodificarMail', (req, res) => __awaiter(this, void 0, void 0, function* () {
            let decodificado;
            try {
                decodificado = jsonwebtoken_1.default.verify(req.body.token, process.env.TOKEN_SECRET || 'prueba');
                const result1 = yield this.queryUsuario(decodificado);
                if (result1.length == 0)
                    res.json(0);
                else
                    res.json(result1[0]);
            }
            catch (err) {
                res.json(0);
            }
        }));
        this.app.post('/sendOfferEmail', (req, res) => {
            const tempres = emailOffer(req.body);
            if (tempres.Success == 0) {
                return res.json({ message: 'Error sending email', status: 500 });
            }
            else {
                res.json({ message: 'Email sent successfully!', status: 200 });
            }
        });
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
