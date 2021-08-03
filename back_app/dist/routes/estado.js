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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estado_model_1 = require("../models/estado.model");
const estadoRoutes = express_1.Router();
//Obtener registros
estadoRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const estado = yield estado_model_1.Estado.find().exec();
    res.json({
        ok: true,
        estado: estado
    });
}));
//crear registros
estadoRoutes.post('/create', (req, res) => {
    const estado = {
        Nombre: req.body.Nombre,
    };
    estado_model_1.Estado.create(estado).then(userDB => {
        res.json({
            ok: true,
            user: userDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//Editar registros
estadoRoutes.post('/update', (req, res) => {
    const estado = {
        Nombre: req.body.Nombre,
        _id: req.body._id || req.estado._id
    };
    const id = estado._id;
    estado_model_1.Estado.findByIdAndUpdate(id, estado, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un estado con ese Id'
            });
        }
    });
});
exports.default = estadoRoutes;
