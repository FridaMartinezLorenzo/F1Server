"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driversRoutes_1 = __importDefault(require("./routes/driversRoutes"));
const teamsRoutes_1 = __importDefault(require("./routes/teamsRoutes"));
const countriesRoutes_1 = __importDefault(require("./routes/countriesRoutes"));
const gpRoutes_1 = __importDefault(require("./routes/gpRoutes"));
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const salesRoutes_1 = __importDefault(require("./routes/salesRoutes"));
const circuitsRoutes_1 = __importDefault(require("./routes/circuitsRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const shoppingcartsRoutes_1 = __importDefault(require("./routes/shoppingcartsRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.app.use('/documentacion', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
    }
    config() {
        this.app.set('port', process.env.PORT || 3000); //En que puerto va a ejecutar
        this.app.use((0, morgan_1.default)('dev')); //que ejecutamos y que tiempo
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json()); //permite que utilicemos json
        this.app.use(express_1.default.urlencoded({ extended: false })); //decodifca las url
    }
    routes() {
        this.app.use('/api/drivers', driversRoutes_1.default);
        this.app.use('/api/teams', teamsRoutes_1.default);
        this.app.use('/api/circuits', circuitsRoutes_1.default);
        this.app.use('/api/countries', countriesRoutes_1.default);
        this.app.use('/api/gp', gpRoutes_1.default);
        this.app.use('/api/products', productsRoutes_1.default);
        this.app.use('/api/sales', salesRoutes_1.default);
        this.app.use('/api/users', usersRoutes_1.default);
        this.app.use('/api/shoppingcarts', shoppingcartsRoutes_1.default);
        //this.app.use('/api/address', adressRoutes);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('El servidor se esta ejecutando en el puerto: ', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
