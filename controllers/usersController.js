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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
            const respuesta = yield database_1.default.query('SELECT * FROM users WHERE Email = ?', [req.body.Email]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.json({ 'IdUser': -1 });
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcryptjs_1.default.genSalt(10);
            req.body.Password = yield bcryptjs_1.default.hash(req.body.Password, salt);
            // Add the value for is_admin
            //req.body.is_admin = 0;
            try {
                const resp = yield database_1.default.query("INSERT INTO users set ?", [req.body]);
                res.json(resp);
            }
            catch (error) {
                res.json({ "message": "The email is already in use" });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const resp = yield database_1.default.query("UPDATE users SET Name = ?, LastName = ?, Email = ?,photo=? WHERE IdUser = ?", [req.body.Name, req.body.LastName, req.body.Email, req.body.photo, id]);
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
            const { Password } = req.body;
            try {
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(Password, salt);
                const resp = yield database_1.default.query("UPDATE users SET Password = ? WHERE IdUser = ?", [hashedPassword, id]);
                if (resp.affectedRows > 0) {
                    res.json({ message: 'Contraseña actualizada correctamente.' });
                }
                else {
                    res.status(404).json({ error: 'No se encontró el usuario.' });
                }
            }
            catch (error) {
                console.error('Error al actualizar la contraseña:', error);
                res.status(500).json({ error: 'Se produjo un error al actualizar la contraseña.' });
            }
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
            const respuesta = yield database_1.default.query('SELECT * FROM users WHERE Email = ?', [req.body.Email]);
            console.log("res:", respuesta);
            if (respuesta.length > 0) {
                bcryptjs_1.default.compare(req.body.Password, respuesta[0].Password, (err, result) => {
                    if (result) {
                        res.json(respuesta[0]);
                    }
                    else {
                        res.json({ 'IdUser': -1 });
                    }
                });
            }
            else {
                console.log("res:", respuesta);
                res.json({ 'IdUser': -1 });
            }
        });
    }
    verifyAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield database_1.default.query('SELECT * FROM users WHERE Email = ? AND is_admin = 1', [req.body.Email]);
                console.log("res:", respuesta);
                if (respuesta.length > 0) {
                    bcryptjs_1.default.compare(req.body.Password, respuesta[0].Password, (err, result) => {
                        if (result) {
                            res.json(respuesta[0]);
                        }
                        else {
                            res.json({ 'IdUser': -1 });
                        }
                    });
                }
                else {
                    res.json({ 'IdUser': -1 });
                }
            }
            catch (error) {
                console.error('Error al verificar administrador:', error);
                res.status(500).json({ error: 'Se produjo un error al verificar el administrador.' });
            }
        });
    }
    updatePasswordT(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            console.log("token", token);
            const decoded = decodeJWT(token);
            console.log(decoded);
            const exist = yield database_1.default.query("SELECT * FROM users WHERE Email = ?", [decoded]);
            if (exist.length == 0) {
                res.json({ IdUser: -1 });
                return;
            }
            else {
                const salt = yield bcryptjs_1.default.genSalt(10);
                req.body.Password = yield bcryptjs_1.default.hash(req.body.Password, salt);
                const resp = yield database_1.default.query("UPDATE users SET Password = ? WHERE Email = ?", [req.body.Password, decoded]);
                res.json(exist);
            }
        });
    }
}
function decodeJWT(token) {
    return (Buffer.from(token.split('.')[1], 'base64').toString());
}
exports.usersController = new UsersController();
