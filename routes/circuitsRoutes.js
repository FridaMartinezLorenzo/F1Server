"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const circuitsController_1 = require("../controllers/circuitsController");
class CircuitsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showAllcircuits/', circuitsController_1.circuitsController.showAllcircuits);
        this.router.get('/getCircuit/:id', circuitsController_1.circuitsController.getCircuit);
        this.router.post('/createCircuit/', circuitsController_1.circuitsController.createCircuit);
        this.router.put('/updateCircuit/:id', circuitsController_1.circuitsController.updateCircuit);
        this.router.delete('/deleteCircuit/:id', circuitsController_1.circuitsController.deleteCircuit);
        //this.router.get('/showAllcircuits/',validarToken,circuitsController.showAllcircuits);
        //this.router.get('/getCircuit/:id',validarToken,circuitsController.getCircuit);
        //this.router.post('/createCircuit/',validarToken,circuitsController.createCircuit);
        //this.router.put('/updateCircuit/:id',validarToken,circuitsController.updateCircuit);
        //this.router.delete('/deleteCircuit/:id',validarToken,circuitsController.deleteCircuit);
    }
}
const circuitsRoutes = new CircuitsRoutes();
exports.default = circuitsRoutes.router;
