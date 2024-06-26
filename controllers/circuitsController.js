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
exports.circuitsController = void 0;
const database_1 = __importDefault(require("../database")); //acceso a la base de datos
class CircuitsController {
    showAllcircuits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM circuits');
            res.json(respuesta);
        });
    }
    getCircuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM circuits WHERE IdCircuit = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'message': 'Circuit not found' });
        });
    }
    createCircuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query("INSERT INTO circuits set ?", [req.body]);
            res.json(resp);
        });
    }
    updateCircuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const resp = yield database_1.default.query("UPDATE circuits set ? WHERE IdCircuit = ?", [req.body, id]);
            res.json(resp);
        });
    }
    deleteCircuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                //Buscar si realizan incidencias en la tabla de gp antes de eliminar el circuito
                const resp_gp = yield database_1.default.query(`SELECT * FROM gp WHERE IdCircuit = ${id} LIMIT 1`);
                console.log(resp_gp);
                if (resp_gp.length > 0) {
                    res.json({ exito: -1, message: "No se puede eliminar el circuito porque tiene registros asociados en la tabla gp" });
                    return;
                }
                const resp = yield database_1.default.query(`DELETE FROM circuits WHERE IdCircuit = ${id}`);
                res.json(resp);
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
}
exports.circuitsController = new CircuitsController();
