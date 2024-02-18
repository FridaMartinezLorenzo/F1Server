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
exports.salesController = void 0;
const database_1 = __importDefault(require("../database")); //acceso a la base de datos
class SalesController {
    showAllsales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT sales.IdSale, users.IdUser, users.Name, users.LastName, Date,products.IdProduct, products.Name as Product, Quantity FROM sales,sales_products, products, users where sales.IdSale = sales_products.IdSale and sales.IdUser = users.IdUser and products.IdProduct = sales_products.IdProduct;');
            res.json(respuesta);
        });
    }
    getSale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT sales.IdSale, users.IdUser, users.Name, users.LastName, Date,products.IdProduct, products.Name as Product, Quantity FROM sales,sales_products, products, users where sales.IdSale = ? and sales.IdSale = sales_products.IdSale and sales.IdUser = users.IdUser and products.IdProduct = sales_products.IdProduct;', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta);
            }
            res.json({ 'message': 'Sale not found', 'IdSale': -1 });
        });
    }
    getSaleByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT sales.IdSale, users.IdUser, users.Name, users.LastName, Date,products.IdProduct, products.Name as Product, Quantity FROM sales,sales_products, products, users where sales.IdSale = sales_products.IdSale and sales.IdUser = users.IdUser and products.IdProduct = sales_products.IdProduct and users.IdUser = ?;', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.json({ 'message': 'Sale not found', 'IdSale': -1 });
            return;
        });
    }
    getSaleByProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT sales.IdSale,users.IdUser, users.Name, users.LastName, Date,products.IdProduct, products.Name as Product, Quantity FROM sales,sales_products, products, users WHERE products.IdProduct = ? and sales_products.IdSale = sales.IdSale', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.status(404).json({ 'message': 'Sale not found' });
        });
    }
    getTotalSale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT * FROM sales WHERE IdSale = ?', [id]);
            if (respuesta.length > 0) {
                var total = 0;
                const productos = yield database_1.default.query('SELECT * FROM sales_products WHERE IdSale = ?', [id]);
                for (let i = 0; i < productos.length; i++) {
                    const element = productos[i];
                    const product = yield database_1.default.query('SELECT * FROM products WHERE IdProduct = ?', [element.IdProduct]);
                    total = total + (element.Quantity * product[0].Price);
                }
                var totalRes = { "Total": total };
                res.json(totalRes);
                return;
            }
            res.status(404).json({ 'message': 'Sale not found' });
        });
    }
    createSaleWithCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; //Id de usuario
            const respuesta = yield database_1.default.query(`SELECT * FROM cart_user where IdUser = ?`, [id]);
            if (respuesta.length > 0) {
                const Products = yield database_1.default.query(`SELECT IdProduct, Quantity FROM cart_product WHERE IdCart = ?`, [respuesta[0].IdCart]);
                if (Products.length > 0) {
                    // Verificar stock para cada producto en el carrito
                    let outOfStockProducts = [];
                    for (const product of Products) {
                        const productData = yield database_1.default.query(`SELECT PiecesInStock FROM products WHERE IdProduct = ?`, [product.IdProduct]);
                        if (productData[0].PiecesInStock < product.Quantity) {
                            outOfStockProducts.push(product.IdProduct);
                        }
                    }
                    if (outOfStockProducts.length === 0) {
                        // Si todos los productos tienen suficiente stock, proceder con la venta
                        const datosSale = { "IdUser": respuesta[0].IdUser, "Date": req.body.Date };
                        const resp = yield database_1.default.query("INSERT INTO sales set ?", [datosSale]);
                        const idSale = resp.insertId;
                        for (const product of Products) {
                            const datosTicket = { "IdProduct": product.IdProduct, "Quantity": product.Quantity, "IdSale": idSale };
                            yield database_1.default.query(`INSERT INTO sales_products set ?`, [datosTicket]);
                            yield database_1.default.query(`UPDATE products SET PiecesInStock = PiecesInStock - ${product.Quantity} WHERE IdProduct = ${product.IdProduct}`);
                        }
                        // Limpiamos el carrito
                        yield database_1.default.query(`DELETE FROM cart_user WHERE IdUser = ${id}`);
                        yield database_1.default.query(`DELETE FROM cart_product WHERE IdCart = ${respuesta[0].IdCart}`);
                        // Enviamos una respuesta de éxito con los datos de la venta
                        const lastQuery = yield database_1.default.query(`SELECT * FROM sales WHERE IdSale = ?`, [idSale]);
                        res.status(200).json(lastQuery);
                    }
                    else {
                        // Si hay productos sin suficiente stock, enviar una respuesta de error
                        res.status(400).json({ 'message': 'Not enough stock for products', 'outOfStockProducts': 1 });
                    }
                }
                else {
                    // Enviamos una respuesta de error 404 si no se encuentran productos en el carrito
                    res.status(404).json({ 'message': 'Cart does not contain any products' });
                }
            }
            else {
                // Enviamos una respuesta de error 404 si no se encuentra ningún carrito para el usuario
                res.status(404).json({ 'message': 'Cart not found, we cant do a sale without a cart' });
            }
        });
    }
    createSaleWithoutCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const datosSale = { "IdUser": req.body.IdUser, "Date": req.body.Date };
            const resp = yield database_1.default.query("INSERT INTO sales set ?", [datosSale]);
            const idSale = resp.insertId;
            const datosTicket = { "IdProduct": req.body.IdProduct, "Quantity": req.body.Quantity, "IdSale": idSale };
            const ans = yield database_1.default.query(`INSERT INTO sales_products set ?`, [datosTicket]);
            const ajustarStock = yield database_1.default.query(`UPDATE products SET PiecesInStock = PiecesInStock  - ${req.body.Quantity} WHERE IdProduct = ${req.body.IdProduct}`);
            res.json(ans);
        });
    }
    updateSale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log(id);
            const resp = yield database_1.default.query("UPDATE sales set ? WHERE IdSale = ?", [req.body, id]);
            res.json(resp);
        });
    }
    deleteSale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM sales WHERE IdSale = ${id}`);
            const resp2 = yield database_1.default.query(`DELETE FROM sales_products WHERE IdSale = ${id}`);
            res.json(resp);
        });
    }
    getSaleByYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { year } = req.params;
            const respuesta = yield database_1.default.query(`SELECT sales.IdSale, users.IdUser, users.Name, users.LastName, Date,products.IdProduct, products.Name as Product, Quantity FROM sales,sales_products, products, users where sales.IdSale = sales_products.IdSale and sales.IdUser = users.IdUser and products.IdProduct = sales_products.IdProduct and YEAR(sales.Date) = ${year}`);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.json({ 'IdSale': -1, 'message': 'No sales found for this year' });
        });
    }
    getSaleByMonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { month } = req.params;
            const respuesta = yield database_1.default.query(`SELECT sales.IdSale, users.IdUser, users.Name, users.LastName, Date,products.IdProduct, products.Name as Product, Quantity FROM sales,sales_products, products, users where sales.IdSale = sales_products.IdSale and sales.IdUser = users.IdUser and products.IdProduct = sales_products.IdProduct and MONTH(sales.Date) = ${month}`);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.json({ 'IdSale': -1, 'message': 'No sales found for this month' });
        });
    }
    getSaleByDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date } = req.params;
            const respuesta = yield database_1.default.query(`SELECT sales.IdSale, users.IdUser, users.Name, users.LastName, Date,products.IdProduct, products.Name as Product, Quantity FROM sales,sales_products, products, users where sales.IdSale = sales_products.IdSale and sales.IdUser = users.IdUser and products.IdProduct = sales_products.IdProduct and DATE(sales.Date) = '${date}'`);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.json({ 'IdSale': -1, 'message': 'No sales found for this date' });
        });
    }
}
exports.salesController = new SalesController();
