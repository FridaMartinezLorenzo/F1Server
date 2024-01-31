"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teamsController_1 = require("../controllers/teamsController");
class TeamsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showAllteams/', teamsController_1.teamsController.showAllteams);
        this.router.get('/getTeam/:id', teamsController_1.teamsController.getTeam);
        this.router.post('/createTeam/', teamsController_1.teamsController.createTeam);
        this.router.put('/updateTeam/:id', teamsController_1.teamsController.updateTeam);
        this.router.delete('/deteleTeam/:id', teamsController_1.teamsController.deleteTeam);
        //this.router.get('/showAllteams/',validarToken,teamsController.showAllteams);
        //this.router.get('/getTeam/:id',validarToken,teamsController.getTeam);
        //this.router.post('/createTeam/',validarToken,teamsController.createTeam);
        //this.router.put('/updateTeam/:id',validarToken,teamsController.updateTeam);
        //this.router.delete('/deteleTeam/:id',validarToken,teamsController.deleteTeam);
    }
}
const teamsRoutes = new TeamsRoutes();
exports.default = teamsRoutes.router;
