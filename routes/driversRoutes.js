"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const driversController_1 = require("../controllers/driversController");
class DriversRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //this.router.get('/showAlldrivers/',validarToken,driversController.showAlldrivers);
        //this.router.get('/getDriver/:id',validarToken,driversController.getDriver);
        //this.router.post('/createDriver/',validarToken,driversController.createDriver);
        //this.router.put('/updateDriver/:id',validarToken,driversController.updateDriver);
        //this.router.delete('/deleteDriver/:id',validarToken,driversController.deleteDriver);
        this.router.get('/showAlldrivers/', driversController_1.driversController.showAlldrivers);
        this.router.get('/getDriver/:id', driversController_1.driversController.getDriver);
        this.router.post('/createDriver/', driversController_1.driversController.createDriver);
        this.router.put('/updateDriver/:id', driversController_1.driversController.updateDriver);
        this.router.delete('/deleteDriver/:id', driversController_1.driversController.deleteDriver);
    }
}
const driversRoutes = new DriversRoutes();
exports.default = driversRoutes.router;
