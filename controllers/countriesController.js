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
exports.countriesController = void 0;
const database_1 = __importDefault(require("../database")); //acceso a la base de datos
class CountriesController {
    showAllCountries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM countries');
            res.json(respuesta);
        });
    }
    getCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM countries WHERE IdCountry = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'message': 'Country not found' });
        });
    }
    createCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Name, Nombre } = req.body;
            const resp = yield database_1.default.query("INSERT INTO countries (Name, Nombre) VALUES (?, ?)", [Name, Nombre]);
            res.json(resp);
        });
    }
    updateCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const resp = yield database_1.default.query("UPDATE countries set ? WHERE IdCountry = ?", [req.body, id]);
            res.json(resp);
        });
    }
    deleteCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                //Buscar si realizan incidencias en la tabla de drivers antes de eliminar el pais
                const resp_drivers = yield database_1.default.query(`SELECT * FROM drivers WHERE IdCountry = ${id} LIMIT 1`);
                if (resp_drivers.length > 0) {
                    res.json({ exito: -1, message: "No se puede eliminar el pais porque tiene registros asociados en la tabla drivers" });
                    return;
                }
                //Buscar si realizan incidencias en la tabla de circuits antes de eliminar el pais
                const resp_gp = yield database_1.default.query(`SELECT * FROM circuits WHERE IdCountry = ${id} LIMIT 1`);
                if (resp_gp.length > 0) {
                    res.json({ exito: -1, message: "No se puede eliminar el pais porque tiene registros asociados en la tabla circuits" });
                    return;
                }
                //Eliminar pais sino hay relaciones en las tablas drivers y circuits
                const resp = yield database_1.default.query(`DELETE FROM countries WHERE IdCountry = ${id}`);
                res.json(resp);
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
}
exports.countriesController = new CountriesController();
