"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
var email = require("emailjs/email");
function sendEmailOffers(body) {
    console.log("Lista de productos:");
    body.Products.forEach((product) => {
        console.log("- Nombre: ", product.Name);
        console.log("  ID: ", product.IdProduct);
        console.log("  Cantidad en Stock: ", product.PiecesInStock);
        console.log("  Precio: ", product.Price);
        console.log("  ID del Equipo: ", product.IdTeam);
        console.log("\n"); // Para separar cada producto en la salida de la consola
    });
    var server = email.server.connect({
        user: "apexformula.net@gmail.com",
        password: "txuffbyqasglpzdu",
        host: "smtp.gmail.com",
        tls: {
            rejectUnauthorized: false
        }
    });
    // Tokenizar el correo electrónico
    const emailToken = jsonwebtoken_1.default.sign({ email: body.email }, process.env.JWT_SECRET || 'secret');
    console.log("correo tokenizado", emailToken);
    // Construir la lista de nombres de productos uwu
    let productListWithLinks = '';
    body.Products.forEach((product) => {
        const link = `<a href="http://localhost:4200/home/store/shoppingcart/${emailToken}/${body.id}/${product.IdProduct}">Click here</a>`;
        productListWithLinks += `<li>${product.Name}: ${link}</li>`;
    });
    var message = {
        from: "apexformula.net@gmail.com",
        to: "<" + body.Email + ">",
        bbc: "",
        subject: "We have offers for you!",
        attachment: [
            {
                data: `
            <h1>Hi, we have offers for you!</h1>
            <h2>${body.NameOffer}</h2>
            <br>
            <p>${body.InfoOffer}</p>
            <p>Discount of ${body.percentdiscount}%</p>
            <h3>Products:</h3>
            <ul>
                ${productListWithLinks}   
            </ul>
           <!-- Este es un comentario en HTML. 
           <a href="http://localhost:4200/home/store/shoppingcart/${emailToken}/${body.id}">Click here<a/> -->
           `, alternative: true
            }
        ]
    };
    var result = { "Success": 1 };
    server.send(message, function (err, message) {
        if (err) {
            console.error("Error sending email:", err);
            result.Success = 0;
        }
        else {
            console.log(body);
            console.log("Email sent successfully wiiiiiiiiiiii!");
            result.Success = 1;
        }
    });
    return result;
}
module.exports = sendEmailOffers;
