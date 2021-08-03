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
const producto_model_1 = require("../models/producto.model");
const productoRoutes = express_1.Router();
//Obtener registros
productoRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const producto = yield producto_model_1.Producto.find().exec();
    res.json({
        ok: true,
        producto: producto
    });
}));
//crear registros
productoRoutes.post('/create', (req, res) => {
    const producto = {
        Nombre: req.body.Nombre,
        Maximo: req.body.Maximo,
        Minimo: req.body.Minimo
    };
    producto_model_1.Producto.create(producto).then(userDB => {
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
productoRoutes.post('/update', (req, res) => {
    const producto = {
        Nombre: req.body.Nombre || req.producto.Nombre,
        Maximo: req.body.Maximo || req.producto.Maximo,
        Minimo: req.body.Minimo || req.producto.Minimo,
        _id: req.body._id || req.producto._id
    };
    const id = producto._id;
    producto_model_1.Producto.findByIdAndUpdate(id, { Nombre: producto.Nombre, Maximo: producto.Maximo, Minimo: producto.Minimo }, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un producto con ese Id'
            });
        }
    });
});
//Editar registros
productoRoutes.post('/delete', (req, res) => {
    const producto = {
        _id: req.body._id || req.producto._id
    };
    const id = producto._id;
    producto_model_1.Producto.findByIdAndRemove(id).catch(err => {
        console.log("error", err);
    });
});
exports.default = productoRoutes;
