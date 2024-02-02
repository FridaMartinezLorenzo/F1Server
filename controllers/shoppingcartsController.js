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
                const respuesta = yield database_1.default.query('SELECT cart_product.IdCart, cart_product.IdProduct, cart_product.Quantity FROM cart_user,cart_product WHERE cart_product.IdCart = ?;', [IdCart]);
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
    addItemToShoppingCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respCart_User = yield database_1.default.query("SELECT IdCart FROM cart_user WHERE IdUser = ?", [id]);
            const IdCart = respCart_User[0].IdCart;
            const addItem = { "IdCart": IdCart, "IdProduct": req.body.IdProduct, "Quantity": req.body.Quantity };
            const resp = yield database_1.default.query("INSERT INTO cart_product set ?", [addItem]);
            res.json(resp);
        });
    }
    deleteShoppingcart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const gettingIdCart = yield database_1.default.query('SELECT IdCart FROM cart_user WHERE IdUser = ?', [id]);
            console.log(gettingIdCart);
            const IdCart = gettingIdCart[0].IdCart;
            const resp = yield database_1.default.query(`DELETE FROM cart_user WHERE IdUser = ${id}`);
            const resp2 = yield database_1.default.query(`DELETE FROM cart_product WHERE IdCart = ${IdCart}`);
            res.json(resp);
        });
    }
}
exports.shoppingcartsController = new ShoppingcartsController();
