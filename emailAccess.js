"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
var email = require("emailjs/email");
function sendEmail(body) {
    console.log("Body: ", body);
    var server = email.server.connect({
        user: "apexformula.net@gmail.com",
        password: "txuffbyqasglpzdu",
        host: "smtp.gmail.com",
        tls: {
            rejectUnauthorized: false
        }
    });
    //Tokenizamos el correo para poder ponerlo en la liga
    var correo = body.Email;
    const token = jsonwebtoken_1.default.sign(correo, process.env.TOKEN_SECRET || 'prueba');
    console.log(token);
    var message = {
        from: "apexformula.net@gmail.com",
        to: "<" + body.Email + ">",
        bbc: "",
        subject: "Change your password!",
        attachment: [
            { data: `
            <h1>Hi, we detected that you want to change your password</h1>
            <p>Click the following link to change your password:</p>
            <a href="http://localhost:4200/resetPassword/${token}">Click here<a/>`, alternative: true }
        ]
    };
    var result = { "Success": 1 };
    server.send(message, function (err, message) {
        if (err) {
            console.error("Error sending email:", err);
            result.Success = 0;
        }
        else {
            console.log("Email sent successfully!");
            result.Success = 1;
        }
    });
    return result;
}
module.exports = sendEmail;
