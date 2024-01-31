"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gpController_1 = require("../controllers/gpController");
class GPRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showAllGP/', gpController_1.gpController.show_all_GP);
        this.router.get('/getGP/:id', gpController_1.gpController.getGP);
        this.router.post('/createGP/', gpController_1.gpController.createGP);
        this.router.put('/updateGP/:id', gpController_1.gpController.updateGP);
        this.router.delete('/deleteGP/:id', gpController_1.gpController.deleteGP);
        //this.router.get('/showAllGP/',validarToken,gpController.show_all_GP);
        //this.router.get('/getGP/:id',validarToken,gpController.getGP);
        //this.router.post('/createGP/',validarToken,gpController.createGP);
        //this.router.put('/updateGP/:id',validarToken,gpController.updateGP);
        //this.router.delete('/deleteGP/:id',validarToken,gpController.deleteGP);
    }
}
const gpRoutes = new GPRoutes();
exports.default = gpRoutes.router;
