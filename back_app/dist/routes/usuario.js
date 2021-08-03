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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const userRoutes = express_1.Router();
//Login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                apellido: userDB.apellido,
                celular: userDB.celular,
                localizacion: userDB.localizacion,
                idUsuario: userDB.idUsuario,
                codigoMostrar: userDB.codigoMostrar,
                estado: userDB.estado,
                pushUserId: userDB.pushUserId,
                granja: userDB.granja,
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos ****',
            });
        }
    });
});
//obtener User
userRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield usuario_model_1.Usuario.find().exec();
    res.json({
        ok: true,
        users: users
    });
}));
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        celular: req.body.celular,
        email: req.body.email,
        localizacion: req.body.localizacion,
        idUsuario: req.body.idUsuario,
        codigoMostrar: req.body.codigoMostrar,
        estado: req.body.estado,
        pushUserId: req.body.pushUserId,
        granja: req.body.granja,
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
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
//Actualizar usuario
//userRoutes.post('/update', verificaToken, (req: any, res: Response)=>{
userRoutes.post('/update', (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        apellido: req.body.apellido || req.usuario.apellido,
        celular: req.body.celular || req.usuario.celular,
        email: req.body.email || req.usuario.email,
        localizacion: req.body.localizacion || req.usuario.localizacion,
        idUsuario: req.body.idUsuario || req.usuario.idUsuario,
        codigoMostrar: req.body.codigoMostrar || req.usuario.codigoMostrar,
        estado: req.body.estado || req.usuario.estado,
        pushUserId: req.body.pushUserId,
        granja: req.body.granja || req.usuario.granja,
        password: req.body.password || req.usuario.granja,
        _id: req.body._id || req.usuario._id
    };
    const id = user._id;
    usuario_model_1.Usuario.findByIdAndUpdate(id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese Id'
            });
        }
        /*  const tokenUser = Token.getJwtToken({
             _id: userDB._id,
                 nombre: userDB.nombre,
                 email: userDB.email,
                 apellido: userDB.apellido,
                 celular: userDB.celular,
                 localizacion: userDB.localizacion,
                 idUsuario: userDB.idUsuario,
                 codigoMostrar: userDB.codigoMostrar,
                 estado: userDB.estado,
                 pushUserId: userDB.pushUserId,
                 granja: userDB.granja,
         })
         res.json({
             ok: true,
             token: tokenUser
         }); */
    });
});
exports.default = userRoutes;
