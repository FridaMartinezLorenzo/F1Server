"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = require("../controllers/usersController");
class UsersRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //this.router.get('/showAllusers/',validarToken,usersController.showAllusers);
        //this.router.get('/getUser/:id',validarToken,usersController.getUser);
        //this.router.post('/createUser/',validarToken,usersController.createUser);
        //this.router.put('/updateUserName/:id',validarToken,usersController.updateUserName);
        //this.router.put('/updateUserLastName/:id',validarToken,usersController.updateUserName);
        //this.router.put('/updateUserEmail/:id',validarToken,usersController.updateUserEmail);
        //this.router.put('/updateUserPassword/:id',validarToken,usersController.updateUserPassword);
        //this.router.delete('/deleteUser/:id',validarToken,usersController.deleteUser);
        //this.router.post('/verifyUser/',usersController.verifyUser);
        this.router.get('/showAllusers/', usersController_1.usersController.showAllusers);
        this.router.get('/getUser/:id', usersController_1.usersController.getUser);
        this.router.post('/createUser/', usersController_1.usersController.createUser);
        this.router.put('/updateUser/:id', usersController_1.usersController.updateUser);
        this.router.put('/updateUserName/:id', usersController_1.usersController.updateUserName);
        this.router.put('/updateUserLastName/:id', usersController_1.usersController.updateUserName);
        this.router.put('/updateUserEmail/:id', usersController_1.usersController.updateUserEmail);
        this.router.put('/updateUserPassword/:id', usersController_1.usersController.updateUserPassword);
        this.router.delete('/deleteUser/:id', usersController_1.usersController.deleteUser);
        this.router.post('/verifyUser/', usersController_1.usersController.verifyUser);
        this.router.post('/verifyAdmin/', usersController_1.usersController.verifyAdmin);
        this.router.post('/getUserByEmail/', usersController_1.usersController.getUserEmail);
        this.router.put('/updateUserPasswordT/:token', usersController_1.usersController.updatePasswordT);
    }
}
const usersRoutes = new UsersRoutes();
exports.default = usersRoutes.router;
