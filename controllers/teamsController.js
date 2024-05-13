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
exports.teamsController = void 0;
const database_1 = __importDefault(require("../database")); //acceso a la base de datos
class TeamsController {
    showAllteams(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ans = yield database_1.default.query('SELECT * FROM teams');
            res.json(ans);
        });
    }
    getTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const ans = yield database_1.default.query('SELECT * FROM teams WHERE idTeam = ?', [id]);
            if (ans.length > 0) {
                res.json(ans[0]);
                return;
            }
            res.status(404).json({ 'message': 'Team not found' });
        });
    }
    createTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query("INSERT INTO teams set ?", [req.body]);
            res.json(resp);
        });
    }
    updateTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const resp = yield database_1.default.query("UPDATE teams set ? WHERE IdTeam = ?", [req.body, id]);
            res.json(resp);
        });
    }
    deleteTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                //revisar si hay algun producto relacionado con team
                const resp_drivers = yield database_1.default.query(`SELECT * FROM products WHERE IdTeam = ${id} LIMIT 1`);
                if (resp_drivers.length > 0) {
                    res.json({ exito: -1, message: "Existen productos asociados al equipo, no es posible eliminarlo" });
                    return;
                }
                //revisar si hay algun driver relacionado con el team
                const resp_gp = yield database_1.default.query(`SELECT * FROM drivers WHERE IdTeam = ${id} LIMIT 1`);
                if (resp_gp.length > 0) {
                    res.json({ exito: -1, message: "Existen productos asociados al equipo, no es posible eliminarlo" });
                    return;
                }
                //si paso el filtr, se elimina
                const resp_teams = yield database_1.default.query(`DELETE FROM teams WHERE IdTeam = ${id}`);
                res.json(resp_teams);
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
}
exports.teamsController = new TeamsController();
