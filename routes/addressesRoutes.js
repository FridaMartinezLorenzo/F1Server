"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressesController_1 = require("../controllers/addressesController");
class AddressesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showAlladdresses/', addressesController_1.addressesController.showAlladdresses);
        this.router.get('/getAddress/:id', addressesController_1.addressesController.getAddress);
        this.router.post('/createAddress/', addressesController_1.addressesController.createAddress);
        this.router.put('/updateAddress/:id', addressesController_1.addressesController.updateAddress);
        this.router.delete('/deleteAddress/:id', addressesController_1.addressesController.deleteAddress);
        //this.router.get('/showAlladdresses/',validarToken,addressesController.showAlladdresses);
        //this.router.get('/getAddress/:id',validarToken,addressesController.getAddress);
        //this.router.post('/createAddress/',validarToken,addressesController.createAddress);
        //this.router.put('/updateAddress/:id',validarToken,addressesController.updateAddress);
        //this.router.delete('/deleteAddress/:id',validarToken,addressesController.deleteAddress);
    }
}
const addressesRoutes = new AddressesRoutes();
exports.default = addressesRoutes.router;
