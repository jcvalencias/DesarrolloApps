"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mercado = void 0;
const mongoose_1 = require("mongoose");
const mercadoSchema = new mongoose_1.Schema({
    Nombre: {
        type: String,
        required: [true, 'El nombre es necesaria'],
    }
});
exports.Mercado = mongoose_1.model('Mercados', mercadoSchema);
