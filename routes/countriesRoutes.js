"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const countriesController_1 = require("../controllers/countriesController");
class CountriesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showAllcountries/', countriesController_1.countriesController.showAllCountries);
        this.router.get('/getCountry/:id', countriesController_1.countriesController.getCountry);
        this.router.post('/createCountry/', countriesController_1.countriesController.createCountry);
        this.router.put('/updateCountry/:id', countriesController_1.countriesController.updateCountry);
        this.router.delete('/deleteCountry/:id', countriesController_1.countriesController.deleteCountry);
        //this.router.get('/showAllcountries/',validarToken,countriesController.showAllCountries);
        //this.router.get('/getCountry/:id',validarToken,countriesController.getCountry);
        //this.router.post('/createCountry/',validarToken,countriesController.createCountry);
        //this.router.put('/updateCountry/:id',validarToken,countriesController.updateCountry);
        //this.router.delete('/deleteCountry/:id',validarToken,countriesController.deleteCountry);
    }
}
const countriesRoutes = new CountriesRoutes();
exports.default = countriesRoutes.router;
