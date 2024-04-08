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
exports.shoppingcartsController = void 0;
const database_1 = __importDefault(require("../database")); //acceso a la base de datos
class ShoppingcartsController {
    showAllShoppingcarts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT cart_user.IdCart, cart_user.IdUser, cart_product.IdProduct, cart_product.Quantity FROM cart_user,cart_product;');
            res.json(respuesta);
        });
    }
    getShoppingcart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gettingIdCart = yield database_1.default.query('SELECT IdCart FROM cart_user WHERE IdUser = ?', [id]);
            if (gettingIdCart.length > 0) {
                const IdCart = gettingIdCart[0].IdCart;
                const respuesta = yield database_1.default.query('SELECT cart_product.IdCart, cart_product.IdProduct, cart_product.Quantity FROM cart_user,cart_product WHERE cart_product.IdCart = ? and cart_user.IdCart = cart_product.IdCart;', [IdCart]);
                if (respuesta.length > 0) {
                    res.json(respuesta);
                    return;
                }
            }
            res.json({ message: "The user does not have a shopping cart", IdCart: -1 });
        });
    }
    createShoppingcart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const datosCart_User = { "IdUser": id };
            const resp = yield database_1.default.query("INSERT INTO cart_user set ?", [datosCart_User]);
            const IdCart = resp.insertId;
            //const productosAñadir = req.body.length;
            //console.log(productosAñadir);
            //for (let i = 0; i < productosAñadir; i++) {
            //    const datosCart_Product = {"IdCart": IdCart, "IdProduct": req.body[i].IdProduct, "Quantity": req.body[i].Quantity};
            //    const ans = await pool.query(`INSERT INTO cart_product set ?`, [datosCart_Product]);
            //}
            res.json(resp);
        });
    }
    updateItemQuantityShoppingCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const respCart_User = yield database_1.default.query("SELECT IdCart FROM cart_user WHERE IdUser = ?", [id]);
            const IdCart = respCart_User[0].IdCart;
            console.log("El idCart: ", IdCart);
            console.log("IdProduct : ", req.body.IdProduct, "Quantity :", req.body.Quantity);
            const resp = yield database_1.default.query("UPDATE cart_product SET Quantity = ?  WHERE IdCart = ? and IdProduct = ?", [req.body.Quantity, IdCart, req.body.IdProduct]);
            res.json(resp);
        });
    }
    verifyStockOfProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respCart_User = yield database_1.default.query("SELECT IdCart FROM cart_user WHERE IdUser = ?", [id]);
            if (respCart_User.length > 0) {
                const IdCart = respCart_User[0].IdCart;
                const cart = yield database_1.default.query('SELECT cart_product.IdCart, cart_product.IdProduct, cart_product.Quantity FROM cart_user,cart_product WHERE cart_product.IdCart = ? and cart_user.IdCart = cart_product.IdCart;', [IdCart]);
                if (cart.length > 0) {
                    const nproduct = req.body.length;
                    let resFinal = [];
                    for (let i = 0; i < nproduct; i++) {
                        //Obtenemos el sotck de cada producto
                        const stock = yield database_1.default.query('SELECT Stock FROM product WHERE IdProduct = ?', [req.body[i].IdProduct]);
                        //Si el stock es menor a la cantidad que se quiere comprar, se añade a la respuesta final
                        if (stock[0].Stock < req.body[i].Quantity) {
                            resFinal.push({ IdProduct: req.body[i].IdProduct, Stock: stock[0].Stock }); //Guardamos el stock del maximo que se puede comprar
                        }
                    }
                    if (resFinal.length > 0) {
                        res.json(resFinal);
                    }
                    else {
                        res.json({ message: "All products are available", IdCart: IdCart, AllInStock: 1 });
                        return;
                    }
                }
            }
            else {
                res.json({ message: "The user does not have a shopping cart", IdCart: -1 });
            }
        });
    }
    addItemToShoppingCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const respCart_User = yield database_1.default.query("SELECT IdCart FROM cart_user WHERE IdUser = ?", [id]);
                const IdCart = respCart_User[0].IdCart;
                const addItem = { "IdCart": IdCart, "IdProduct": req.body.IdProduct, "Quantity": req.body.Quantity };
                const resp = yield database_1.default.query("INSERT INTO cart_product set ?", [addItem]);
                res.json(resp);
            }
            catch (error) {
                console.error("Error adding item to shopping cart:", error);
                res.status(500).json({ error: "An error occurred while adding the item to the shopping cart." });
            }
        });
    }
    deleteShoppingcart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gettingIdCart = yield database_1.default.query('SELECT IdCart FROM cart_user WHERE IdUser = ?', [id]);
            console.log(gettingIdCart);
            if (gettingIdCart.length > 0) {
                const IdCart = gettingIdCart[0].IdCart;
                const resp = yield database_1.default.query(`DELETE FROM cart_user WHERE IdUser = ${id}`);
                const resp2 = yield database_1.default.query(`DELETE FROM cart_product WHERE IdCart = ${IdCart}`);
                res.json(resp);
            }
            else {
                res.json({ message: "The user does not have a shopping cart", IdCart: -1 });
            }
        });
    }
    deleteItemFromShoppingcart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUser, idProduct } = req.params;
            const gettingIdCart = yield database_1.default.query('SELECT IdCart FROM cart_user WHERE IdUser = ?', [idUser]);
            if (gettingIdCart.length > 0) {
                const IdCart = gettingIdCart[0].IdCart;
                const resp = yield database_1.default.query(`DELETE FROM cart_product WHERE IdCart = ${IdCart} and IdProduct = ${idProduct}`);
                res.json(resp);
            }
        });
    }
    addItemToShoppingCartEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params;
            const decoded = decodeJWT(token);
            const decodedObj = JSON.parse(decoded);
            const correo = decodedObj.correo;
            const exist = yield database_1.default.query("SELECT * FROM users WHERE Email = ?", [correo]);
            const id = exist[0].IdUser; // Accediendo al primer elemento del resultado para obtener IdUser.
            const [respCart] = yield database_1.default.query("SELECT *  FROM cart_user WHERE IdUser = ?", [id]);
            console.log("idcarrito", respCart.IdCart);
            if (respCart.length == 0) {
                res.status(404).json({ message: "Cart not found for the user." });
                return;
            }
            const IdCart = respCart.IdCart;
            const addItem = { "IdCart": IdCart, "IdProduct": req.body.IdProduct, "Quantity": 1 };
            const resp = yield database_1.default.query("INSERT INTO cart_product SET ?", [addItem]);
            res.json({ message: 'Item added to shopping cart successfully', resp });
        });
    }
}
function decodeJWT(token) {
    return (Buffer.from(token.split('.')[1], 'base64').toString());
}
exports.shoppingcartsController = new ShoppingcartsController();
