"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salesController_1 = require("../controllers/salesController");
class SalesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showAllsales/', salesController_1.salesController.showAllsales);
        this.router.get('/getSale/:id', salesController_1.salesController.getSale);
        this.router.get('/getSaleByUser/:id', salesController_1.salesController.getSaleByUser);
        this.router.get('/getSaleByProduct/:id', salesController_1.salesController.getSaleByProduct);
        this.router.get('/getTotalSale/:id', salesController_1.salesController.getTotalSale);
        this.router.put('/updateStateSale/:id', salesController_1.salesController.updateStateSale);
        this.router.post('/createSaleWithCart/:id', salesController_1.salesController.createSaleWithCart);
        this.router.post('/createSaleWithoutCart/', salesController_1.salesController.createSaleWithoutCart);
        this.router.delete('/deleteSale/:id', salesController_1.salesController.deleteSale);
        this.router.get('/getSaleByYear/:year', salesController_1.salesController.getSaleByYear);
        this.router.get('/getSaleByMonth/:month', salesController_1.salesController.getSaleByMonth);
        this.router.get('/getSaleByDate/:date', salesController_1.salesController.getSaleByDate);
        //this.router.put('/updateSale/:id',salesController.updateSale);
        //this.router.get('/showAllsales/',validarToken,salesController.showAllsales);
        //this.router.get('/getSale/:id',validarToken,salesController.getSale);
        //this.router.get('/getSaleByUser/:id',validarToken,salesController.getSaleByUser); 
        //this.router.get('/getSaleByProduct/:id',validarToken,salesController.getSaleByProduct);
        //this.router.get('/getTotalSale/:id',validarToken,salesController.getTotalSale);
        //this.router.post('/createSaleWithCart/:id',validarToken,salesController.createSaleWithCart);
        //this.router.post('/createSaleWithoutCart/',validarToken,salesController.createSaleWithoutCart);
        ////this.router.put('/updateSale/:id',salesController.updateSale);
        //this.router.delete('/deleteSale/:id',validarToken,salesController.deleteSale);
    }
}
const salesRoutes = new SalesRoutes();
exports.default = salesRoutes.router;
