"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estado = void 0;
const mongoose_1 = require("mongoose");
const estadoSchema = new mongoose_1.Schema({
    Nombre: {
        type: Boolean,
        required: [true, 'El estado es necesario'],
    },
});
exports.Estado = mongoose_1.model('Estados', estadoSchema);
