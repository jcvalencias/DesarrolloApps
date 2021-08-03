"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = void 0;
const mongoose_1 = require("mongoose");
const productoSchema = new mongoose_1.Schema({
    Nombre: {
        type: String,
        required: [true, 'El nombre es necesaria'],
    },
    Maximo: {
        type: Number,
        required: [true, 'El precio maxímo es necesario'],
    },
    Minimo: {
        type: Number,
        required: [true, 'El precio minímo es necesario'],
    }
});
exports.Producto = mongoose_1.model('Productos', productoSchema);
