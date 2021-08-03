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
const entrega_model_1 = require("../models/entrega.model");
const entregaRoutes = express_1.Router();
//Obtener registros
entregaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entrega = yield entrega_model_1.Entrega.find().exec();
    res.json({
        ok: true,
        entrega: entrega
    });
}));
//crear registros
entregaRoutes.post('/create', (req, res) => {
    const entrega = {
        Nombre: req.body.Nombre,
    };
    entrega_model_1.Entrega.create(entrega).then(userDB => {
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
entregaRoutes.post('/update', (req, res) => {
    const entrega = {
        Nombre: req.body.Nombre || req.entrega.Nombre,
        _id: req.body._id || req.entrega._id
    };
    const id = entrega._id;
    entrega_model_1.Entrega.findByIdAndUpdate(id, { Nombre: entrega.Nombre }, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese Id'
            });
        }
    });
});
//Eliminar registros
entregaRoutes.post('/delete', (req, res) => {
    const entrega = {
        _id: req.body._id || req.entrega._id
    };
    const id = entrega._id;
    entrega_model_1.Entrega.findByIdAndRemove(id).catch(err => {
        console.log("error", err);
    });
});
exports.default = entregaRoutes;
