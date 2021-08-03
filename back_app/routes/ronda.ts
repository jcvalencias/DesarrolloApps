import { Router, Request, Response } from "express";
import { Ronda } from "../models/ronda.model";


const rondaRoutes = Router();

//Crear registros
rondaRoutes.post('/create', (req: Request, res: Response)=>{
    const user ={
        cantidad: req.body.cantidad,
        comentario: req.body.comentario,
        entrega: req.body.entrega,
        fecha: req.body.fecha,
        mercado: req.body.mercado,
        peso: req.body.peso,
        precio: req.body.precio,
        producto: req.body.producto,
        semana: req.body.semana,
        ultimoDia: req.body.ultimoDia,
        usuario: req.body.usuario,
        year: req.body.year,
    };

    Ronda.create( user ).then( userDB =>{
        res.json({
            ok: true,
            user: userDB
        });
    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });   
})

//Obtener registros
rondaRoutes.get('/', async (req: any, res: Response)=>{
    const rondas = await Ronda.find().exec();
    res.json({
        ok: true,
        rondas: rondas 
    }); 
})

export default rondaRoutes;