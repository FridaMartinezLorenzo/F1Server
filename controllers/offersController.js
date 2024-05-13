"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offersController = void 0;
const database_1 = __importDefault(require("../database"));
class OffersController {
    showAllOffers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield database_1.default.query('SELECT * FROM offers');
            res.json(response);
        });
    }
    getOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield database_1.default.query('SELECT * FROM offers WHERE IdOffer = ?', [id]);
            if (response.length > 0) {
                res.json(response[0]);
                return;
            }
            res.status(404).json({ 'message': 'Offer not found' });
        });
    }
    createOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const DateNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
            try {
                const { offerData, Idproducts } = req.body;
                const { Name, Nombre, PercentDiscount, DateStart, DateEnd } = offerData;
                const response = yield database_1.default.query("INSERT INTO offers (Name, Nombre, PercentDiscount, DateStart,DateEnd) VALUES (?, ?, ?, ?, ?)", [Name, Nombre, PercentDiscount, DateStart, DateEnd]);
                const offerId = response.insertId;
                if (Idproducts && Idproducts.length > 0) {
                    const insertProductsPromises = Idproducts.map((idproduct) => {
                        return database_1.default.query("INSERT INTO offer_product (IdOffer,IdProduct) VALUES (?, ?)", [offerId, idproduct]);
                    });
                    yield Promise.all(insertProductsPromises);
                }
                if (DateStart < DateNow && DateEnd > DateNow) {
                    console.log('Offer is active');
                    //Deshacemos la oferta anterior si es que ya se esta aplicando
                    const [offer] = yield database_1.default.query('SELECT * FROM offers WHERE IdOffer = ?', [offerId]);
                    for (const product of Idproducts) {
                        const unset_offer = yield database_1.default.query('UPDATE products SET Price = Price+((Price/(100-?))*?), Offer = 1 WHERE IdProduct = ?', [offer.PercentDiscount, offer.PercentDiscount, product]);
                    }
                }
                res.json({ message: 'Offer created successfully', offerId: offerId });
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
    updateOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { Name, Nombre, PercentDiscount, DateStart, DateEnd, Products } = req.body;
                const DateNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
                //Hacemos el json de lo que se va a actualizar
                const updatedOffer = {
                    Name,
                    Nombre,
                    PercentDiscount,
                    DateStart,
                    DateEnd
                };
                //En caso de que la oferta este vigente se actualiza el precio de los productos
                if (DateStart < DateNow && DateEnd > DateNow) {
                    console.log('Offer is active');
                    //Deshacemos la oferta anterior si es que ya se esta aplicando
                    const [offer] = yield database_1.default.query('SELECT * FROM offers WHERE IdOffer = ?', [id]);
                    //Obtenemos los productos involucrados en la oferta
                    const products = yield database_1.default.query('SELECT IdProduct FROM offer_product WHERE IdOffer = ?', [id]);
                    console.log('Products:', products);
                    //Deshacemos la oferta en cada producto de la lista, restableciendo el precio original
                    for (const product of products) {
                        const unset_offer = yield database_1.default.query('UPDATE products SET Price = Price+((Price/(100-?))*?),Offer = 0 WHERE IdProduct = ?', [offer.PercentDiscount, offer.PercentDiscount, product.IdProduct]);
                    }
                }
                //Actualizamos lo que hay en la tabla de ofertas
                const response = yield database_1.default.query('UPDATE offers SET ? WHERE IdOffer = ?', [updatedOffer, id]);
                //Actualizamos los productos involucrados en la oferta en la tabla offer_product
                const response2 = yield database_1.default.query('DELETE FROM offer_product WHERE IdOffer = ?', [id]);
                for (const product of Products) {
                    const response3 = yield database_1.default.query('INSERT INTO offer_product (IdOffer, IdProduct) VALUES (?, ?)', [id, product]);
                    if (DateStart < DateNow && DateEnd > DateNow) {
                        //Actualizamos el precio de los productos si la oferta esta vigente
                        const set_offer = yield database_1.default.query('UPDATE products SET Price = (Price-((Price*?)/100)), Offer = 1 WHERE IdProduct = ?', [PercentDiscount, product]);
                    }
                }
                res.json({ message: 'Offer updated successfully' });
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
    getOfferProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield database_1.default.query(`SELECT products.IdProduct, products.Name, products.PiecesInStock, products.Price, products.IdTeam
            FROM products
            JOIN offer_product ON products.IdProduct = offer_product.IdProduct
            JOIN offers ON offer_product.IdOffer = offers.IdOffer
            WHERE offers.IdOffer = ?`, [id]);
            if (response.length > 0) {
                res.json(response);
                return;
            }
            res.status(404).json({ 'message': 'Products not found' });
        });
    }
    deleteOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const offer = yield database_1.default.query('SELECT * FROM offers WHERE IdOffer = ?', [id]);
                if (offer.length != 0) {
                    // Obtener los productos relacionados con la oferta
                    const response_products = yield database_1.default.query('SELECT IdProduct FROM offer_product WHERE IdOffer = ?', [id]);
                    if (response_products.length > 0) {
                        // Deshacer la oferta de los productos
                        const response_discount = yield database_1.default.query('SELECT PercentDiscount FROM offers WHERE IdOffer = ?', [id]);
                        //console.log('Percent:', response_discount[0].PercentDiscount);
                        const unset_offer = yield database_1.default.query(`UPDATE products SET Price = Price + (( Price / ( 100 - ? )) * ?), Offer = 0
                        WHERE IdProduct IN (SELECT IdProduct FROM offer_product WHERE IdOffer = ?)`, [response_discount[0].PercentDiscount, response_discount[0].PercentDiscount, id]);
                        const unset_offer_product = yield database_1.default.query('DELETE FROM offer_product WHERE IdOffer = ?', [id]);
                    }
                    // Eliminar la oferta
                    const response = yield database_1.default.query('DELETE FROM offers WHERE IdOffer = ?', [id]);
                    res.json({ message: 'Offer deleted successfully' });
                }
                else {
                    res.status(404).json({ 'message': 'Offer not found' });
                }
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
    deleteOfferProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, idProduct } = req.params;
                const response = yield database_1.default.query("DELETE FROM `offer_product` WHERE `IdOffer` = ? AND `IdProduct` = ?", [id, idProduct]);
                console.log(response);
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
    verifyOfferDuration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [offer] = yield database_1.default.query('SELECT * FROM offers WHERE IdOffer = ?', [id]);
                const DateNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
                const ds = new Date(offer.DateStart).toISOString().slice(0, 19).replace('T', ' ');
                const de = new Date(offer.DateEnd).toISOString().slice(0, 19).replace('T', ' ');
                //Hacemos la activación de la oferta
                const productsOffer = yield database_1.default.query("SELECT IdProduct FROM offer_product WHERE IdOffer = ?", [offer.IdOffer]);
                const productsOfferIds = productsOffer.map((offer) => offer.IdProduct);
                const products = yield database_1.default.query("SELECT * FROM products");
                if (ds < DateNow && de > DateNow) {
                    console.log('Offer is active');
                    //Modificamos los precios, aplicamos la oferta si y solo si la oferta no se ha aplicado
                    for (const product of products) {
                        if (product.Offer == 0 && productsOfferIds.includes(product.IdProduct)) {
                            //Aplicamos la oferta
                            const set_offer = yield database_1.default.query("UPDATE products SET Price = (Price-((Price*?)/100)), Offer = 1 WHERE IdProduct = ?", [offer.PercentDiscount, product.IdProduct]);
                        }
                    }
                    res.json({ message: 'Offer is active', "active": 1 });
                }
                else {
                    console.log('Offer is not active');
                    //Si la vigencia esta fuera de rango se reestablecen los precios originales, solo si la bandera de offerta esta activada
                    for (const product of products) {
                        if (product.Offer == 1 && productsOfferIds.includes(product.IdProduct)) {
                            const unset_offer = yield database_1.default.query("UPDATE products SET Price = Price+((Price/(100-?))*?), Offer = 0 WHERE IdProduct = ?", [offer.PercentDiscount, offer.PercentDiscount, product.IdProduct]);
                        }
                    }
                    res.json({ message: 'Offer is not active', "active": -1 });
                }
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
    verifyAllOffersDuration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offers = yield database_1.default.query('SELECT * FROM offers');
                for (const offer of offers) {
                    const DateNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    const ds = new Date(offer.DateStart).toISOString().slice(0, 19).replace('T', ' ');
                    const de = new Date(offer.DateEnd).toISOString().slice(0, 19).replace('T', ' ');
                    const productsOffer = yield database_1.default.query("SELECT IdProduct FROM offer_product WHERE IdOffer = ?", [offer.IdOffer]);
                    const productsOfferIds = productsOffer.map((offer) => offer.IdProduct);
                    const products = yield database_1.default.query("SELECT * FROM products");
                    if (ds < DateNow && de > DateNow) {
                        console.log('Offer is active');
                        for (const product of products) {
                            if (product.Offer == 0 && productsOfferIds.includes(product.IdProduct)) {
                                const set_offer = yield database_1.default.query("UPDATE products SET Price = (Price-((Price*?)/100)), Offer = 1 WHERE IdProduct = ?", [offer.PercentDiscount, product.IdProduct]);
                            }
                        }
                    }
                    else {
                        console.log('Offer is not active');
                        for (const product of products) {
                            if (product.Offer == 1 && productsOfferIds.includes(product.IdProduct)) {
                                const unset_offer = yield database_1.default.query("UPDATE products SET Price = Price+((Price/(100-?))*?), Offer = 0 WHERE IdProduct = ?", [offer.PercentDiscount, offer.PercentDiscount, product.IdProduct]);
                            }
                        }
                    }
                }
                res.json({ message: 'Offers verified successfully' });
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
}
exports.offersController = new OffersController();
