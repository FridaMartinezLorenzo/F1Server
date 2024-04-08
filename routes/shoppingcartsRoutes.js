"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shoppingcartsController_1 = require("../controllers/shoppingcartsController");
class ShoppingcartsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //this.router.get('/showAllshoppingcarts/',validarToken,shoppingcartsController.showAllShoppingcarts);
        //this.router.get('/getShoppingcartFromEspecificUser/:id',validarToken,shoppingcartsController.getShoppingcart);
        //this.router.post('/createShoppingcart/:id',validarToken,shoppingcartsController.createShoppingcart);
        //this.router.put('/updateItemQuantityShoppingCart/:id',validarToken,shoppingcartsController.updateItemQuantityShoppingCart);
        //this.router.delete('/deleteShoppingcart/:id',validarToken,shoppingcartsController.deleteShoppingcart);
        this.router.get('/showAllshoppingcarts/', shoppingcartsController_1.shoppingcartsController.showAllShoppingcarts);
        this.router.get('/getShoppingcartFromEspecificUser/:id', shoppingcartsController_1.shoppingcartsController.getShoppingcart);
        this.router.get('/verifyStockOfProducts/:id', shoppingcartsController_1.shoppingcartsController.verifyStockOfProducts);
        this.router.post('/createShoppingcart/:id', shoppingcartsController_1.shoppingcartsController.createShoppingcart);
        this.router.put('/updateItemQuantityShoppingCart/:id', shoppingcartsController_1.shoppingcartsController.updateItemQuantityShoppingCart);
        this.router.post('/addItemToShoppingCart/:id', shoppingcartsController_1.shoppingcartsController.addItemToShoppingCart);
        this.router.delete('/deleteShoppingcart/:id', shoppingcartsController_1.shoppingcartsController.deleteShoppingcart);
        this.router.delete('/deleteItemFromShoppingcart/:idUser/:idProduct', shoppingcartsController_1.shoppingcartsController.deleteItemFromShoppingcart);
        this.router.post('/addItemToShoppingCartEmail/:token', shoppingcartsController_1.shoppingcartsController.addItemToShoppingCartEmail);
    }
}
const shoppingcartsRoutes = new ShoppingcartsRoutes();
exports.default = shoppingcartsRoutes.router;
