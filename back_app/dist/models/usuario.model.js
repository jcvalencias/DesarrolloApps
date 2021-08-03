"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    apellido: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesario'],
    },
    celular: {
        type: Number,
        required: [true, 'El celular es necesario'],
    },
    granja: {
        type: String,
        required: [true, 'La granja es necesaria'],
    },
    localizacion: {
        type: String,
        required: [true, 'La localización es necesaria'],
    },
    estado: {
        type: Boolean,
        default: false,
    },
    idUsuario: {
        type: String,
        default: '',
    },
    codigoMostrar: {
        type: String,
        default: '',
    },
    pushUserId: {
        type: String,
        default: '',
    },
});
usuarioSchema.method('compararPassword', function (password1 = '') {
    if (bcrypt_1.default.compareSync(password1, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model('Usuarios', usuarioSchema);
