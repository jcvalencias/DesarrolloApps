import  Server from "./classes/server";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import express  from "express";
import cors from 'cors';

import userRoutes from "./routes/usuario";
import rondaRoutes from "./routes/ronda";
import productoRoutes from "./routes/producto";
import mercadoRoutes from "./routes/mercado";
import estadoRoutes from "./routes/estado";
import entregaRoutes from "./routes/entrega";

const server = new Server();

//Body parser
 server.app.use( express.urlencoded({ extended: true}));
 server.app.use( express.json());


 //configuración de CORS
    server.app.use(cors({origin: true, credentials: true}));
    
//rutas de mi aplicación
server.app.use('/usuario', userRoutes);
server.app.use('/ronda', rondaRoutes);
server.app.use('/producto', productoRoutes);
server.app.use('/mercado', mercadoRoutes);
server.app.use('/estado', estadoRoutes);
server.app.use('/entrega', entregaRoutes);

//conectar DB
mongoose.connect('mongodb://localhost:27017/RondaSemanal',
{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false}, (err)=>{
    if(err) throw err;
    console.log('Base de datos OnLine');
    
})

//levantar express
server.start(()=>{
    console.log(`Servidor corriendo en puerto ${server.port}`);    
})
