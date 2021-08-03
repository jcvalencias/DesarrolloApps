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
const mercado_model_1 = require("../models/mercado.model");
const mercadoRoutes = express_1.Router();
//Obtener registros
mercadoRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mercado = yield mercado_model_1.Mercado.find().exec();
    res.json({
        ok: true,
        mercados: mercado
    });
}));
//crear registros
mercadoRoutes.post('/create', (req, res) => {
    const mercado = {
        Nombre: req.body.Nombre,
    };
    mercado_model_1.Mercado.create(mercado).then(userDB => {
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
mercadoRoutes.post('/update', (req, res) => {
    const mercado = {
        Nombre: req.body.Nombre || req.mercado.Nombre,
        _id: req.body._id || req.mercado._id
    };
    const id = mercado._id;
    mercado_model_1.Mercado.findByIdAndUpdate(id, { Nombre: mercado.Nombre }, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un mercado con ese Id'
            });
        }
    });
});
//Eliminar registros
mercadoRoutes.post('/delete', (req, res) => {
    const mercado = {
        _id: req.body._id || req.mercado._id,
    };
    const id = mercado._id;
    mercado_model_1.Mercado.findByIdAndRemove(id).catch(err => {
        console.log("error", err);
    });
});
exports.default = mercadoRoutes;
