"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productsController_1 = require("../controllers/productsController");
class ProductsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showAllproducts/', productsController_1.productsController.showAllproducts);
        this.router.get('/getProductByCategory/:id', productsController_1.productsController.getProductByCategory); //Category{MEN, WOMEN, KIDS}
        this.router.get('/getProductByTeam/:id', productsController_1.productsController.getProductByTeam);
        this.router.get('/getProduct/:id', productsController_1.productsController.getProduct);
        this.router.post('/createProduct/', productsController_1.productsController.createProduct);
        this.router.put('/updateProduct/:id', productsController_1.productsController.updateProduct);
        this.router.put('/addStock/:id', productsController_1.productsController.addStock);
        this.router.delete('/deleteProduct/:id', productsController_1.productsController.deleteProduct);
        //this.router.get('/showAllproducts/',validarToken,productsController.showAllproducts);
        //this.router.get('/getProduct/:id',validarToken,productsController.getProduct);
        //this.router.post('/createProduct/',validarToken,productsController.createProduct);
        //this.router.put('/updateProduct/:id',validarToken,productsController.updateProduct);
        //this.router.put('/addStock/:id',validarToken,productsController.addStock);
        //this.router.delete('/deleteProduct/:id',validarToken,productsController.deleteProduct);
    }
}
const productsRoutes = new ProductsRoutes();
exports.default = productsRoutes.router;
