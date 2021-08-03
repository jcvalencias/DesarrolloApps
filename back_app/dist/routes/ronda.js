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
const ronda_model_1 = require("../models/ronda.model");
const rondaRoutes = express_1.Router();
//Crear registros
rondaRoutes.post('/create', (req, res) => {
    const user = {
        cantidad: req.body.cantidad,
        comentario: req.body.comentario,
        entrega: req.body.entrega,
        fecha: req.body.fecha,
        mercado: req.body.mercado,
        peso: req.body.peso,
        precio: req.body.precio,
        producto: req.body.producto,
        semana: req.body.semana,
        ultimoDia: req.body.ultimoDia,
        usuario: req.body.usuario,
        year: req.body.year,
    };
    ronda_model_1.Ronda.create(user).then(userDB => {
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
//Obtener registros
rondaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rondas = yield ronda_model_1.Ronda.find().exec();
    res.json({
        ok: true,
        rondas: rondas
    });
}));
exports.default = rondaRoutes;
