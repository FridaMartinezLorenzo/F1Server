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
exports.usersController = void 0;
const database_1 = __importDefault(require("../database")); //acceso a la base de datos
class UsersController {
    showAllusers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM users');
            res.json(respuesta);
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM users WHERE IdUser = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'message': 'User not found' });
        });
    }
    //Servicio para buscar un correo electronico, ya que solo se permite un correo electronico unico por cuenta
    getUserEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body.email;
            const respuesta = yield database_1.default.query('SELECT * FROM users WHERE Email = ?', [email]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.json({ 'IdUser': -1 });
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield database_1.default.query("INSERT INTO users set ?", [req.body]);
            res.json(resp);
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const resp = yield database_1.default.query("UPDATE users set ? WHERE IdUser = ?", [req.body, id]);
            res.json(resp);
        });
    }
    updateUserName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const resp = yield database_1.default.query("UPDATE users set ? WHERE IdUser = ?", [req.body, id]);
            res.json(resp);
        });
    }
    updateUserLastName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const resp = yield database_1.default.query("UPDATE users set ? WHERE IdUser = ?", [req.body, id]);
            res.json(resp);
        });
    }
    updateUserEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const resp = yield database_1.default.query("UPDATE users set ? WHERE IdUser = ?", [req.body, id]);
            res.json(resp);
        });
    }
    updateUserPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const resp = yield database_1.default.query("UPDATE users set ? WHERE IdUser = ?", [req.body, id]);
            res.json(resp);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM users WHERE IdUser = ${id}`);
            res.json(resp);
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const respuesta = yield database_1.default.query('SELECT * FROM users WHERE Email = ? AND Password = ?', [req.body.Email, req.body.Password]);
            console.log("res:", respuesta);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.json({ 'IdUser': -1 });
        });
    }
    verifyAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const respuesta = yield database_1.default.query('SELECT * FROM users WHERE Email = ? AND Password = ? AND is_admin = 1', [req.body.Email, req.body.Password]);
            console.log("res:", respuesta);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.json({ 'IdUser': -1 });
        });
    }
}
exports.usersController = new UsersController();
