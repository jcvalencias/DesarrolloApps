import { Router, Request, Response } from "express";
import { Mercado } from "../models/mercado.model";

const mercadoRoutes = Router();

//Obtener registros
mercadoRoutes.get('/', async (req: any, res: Response)=>{
    const mercado = await Mercado.find().exec();
    res.json({
        ok: true,
        mercados: mercado 
    }); 
})

//crear registros
mercadoRoutes.post('/create', (req: Request, res: Response)=>{
    const mercado ={        
        Nombre: req.body.Nombre,
    };

    Mercado.create( mercado ).then( userDB =>{
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

//Editar registros
mercadoRoutes.post('/update', (req: any, res: Response)=>{
    const mercado ={
        Nombre: req.body.Nombre || req.mercado.Nombre, 
        _id: req.body._id  || req.mercado._id     
    };
    const id = mercado._id;          
    Mercado.findByIdAndUpdate(id, {Nombre: mercado.Nombre}, { new: true}, (err, userDB)=>{
        if( err ) throw err;
        if( !userDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un mercado con ese Id'
            });
        }
    });
})

//Eliminar registros
mercadoRoutes.post('/delete', (req: any, res: Response)=>{
    const mercado ={
        _id: req.body._id || req.mercado._id, 
    };
    const id = mercado._id;
    Mercado.findByIdAndRemove(id).catch(err=>{
        console.log("error",err);
    });
});


export default mercadoRoutes;