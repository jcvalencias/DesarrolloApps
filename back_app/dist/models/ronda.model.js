"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ronda = void 0;
const mongoose_1 = require("mongoose");
const rondaSchema = new mongoose_1.Schema({
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es necesaria'],
    },
    comentario: {
        type: String,
        default: '',
    },
    entrega: {
        type: String,
        required: [true, 'El lugar de entrega es necesario'],
    },
    fecha: {
        type: String,
        required: [true, 'La fecha es necesario'],
    },
    mercado: {
        type: String,
        required: [true, 'El mercado es necesario'],
    },
    peso: {
        type: Number,
        required: [true, 'El peso es necesario'],
    },
    precio: {
        type: Number,
        required: [true, 'El precio es necesario'],
    },
    ultimoDia: {
        type: String,
        default: '',
    },
    producto: {
        type: String,
        required: [true, 'El producto es necesario'],
    },
    semana: {
        type: Number,
        default: 0,
    },
    usuario: {
        type: String,
        default: '',
    },
    year: {
        type: Number,
        default: 0,
    },
});
exports.Ronda = mongoose_1.model('RondasHistoricas', rondaSchema);
