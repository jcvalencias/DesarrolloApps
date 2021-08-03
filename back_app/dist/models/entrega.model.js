"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entrega = void 0;
const mongoose_1 = require("mongoose");
const entregaSchema = new mongoose_1.Schema({
    Nombre: {
        type: String,
        required: [true, 'El nombre es necesaria'],
    }
});
exports.Entrega = mongoose_1.model('Entregas', entregaSchema);
