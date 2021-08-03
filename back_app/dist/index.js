"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const ronda_1 = __importDefault(require("./routes/ronda"));
const producto_1 = __importDefault(require("./routes/producto"));
const mercado_1 = __importDefault(require("./routes/mercado"));
const estado_1 = __importDefault(require("./routes/estado"));
const entrega_1 = __importDefault(require("./routes/entrega"));
const server = new server_1.default();
//Body parser
server.app.use(express_1.default.urlencoded({ extended: true }));
server.app.use(express_1.default.json());
//configuración de CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
//rutas de mi aplicación
server.app.use('/usuario', usuario_1.default);
server.app.use('/ronda', ronda_1.default);
server.app.use('/producto', producto_1.default);
server.app.use('/mercado', mercado_1.default);
server.app.use('/estado', estado_1.default);
server.app.use('/entrega', entrega_1.default);
//conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/RondaSemanal', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos OnLine');
});
//levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
