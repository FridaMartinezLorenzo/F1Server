"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offersController_1 = require("../controllers/offersController");
class OffersRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showAllOffers/', offersController_1.offersController.showAllOffers);
        this.router.get('/getOffer/:id', offersController_1.offersController.getOffer);
        this.router.post('/createOffer/', offersController_1.offersController.createOffer);
        this.router.put('/updateOffer/:id', offersController_1.offersController.updateOffer);
        this.router.delete('/deleteOffer/:id', offersController_1.offersController.deleteOffer);
        this.router.delete('/deleteOfferProduct/:id/:idProduct', offersController_1.offersController.deleteOfferProduct);
        this.router.get('/getOfferProducts/:id', offersController_1.offersController.getOfferProducts);
        this.router.get('/verifyOfferDuration/:id', offersController_1.offersController.verifyOfferDuration);
        this.router.get('/verifyAllOffersDuration/', offersController_1.offersController.verifyAllOffersDuration);
        //this.router.get('/showTypeOffers/', offersController.showTypeOffers);
        //this.router.get('/showNewPrices/', offersController.showNewPrices);
        this.router.get('/getOfferProducts/:id', offersController_1.offersController.getOfferProducts);
    }
}
const offersRoutes = new OffersRoutes();
exports.default = offersRoutes.router;
