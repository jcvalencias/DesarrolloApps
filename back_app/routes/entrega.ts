import { Router, Request, Response } from "express";
import { Entrega } from "../models/entrega.model";

const entregaRoutes = Router();

//Obtener registros
entregaRoutes.get('/', async (req: any, res: Response)=>{
    const entrega = await Entrega.find().exec();
    res.json({
        ok: true,
        entrega: entrega 
    }); 
})

//crear registros
entregaRoutes.post('/create', (req: Request, res: Response)=>{
    const entrega ={        
        Nombre: req.body.Nombre,
    };

    Entrega.create( entrega ).then( userDB =>{
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
entregaRoutes.post('/update', (req: any, res: Response)=>{
    const entrega ={
        Nombre: req.body.Nombre || req.entrega.Nombre,
        _id: req.body._id || req.entrega._id
    };
    const id = entrega._id;
    Entrega.findByIdAndUpdate(id, {Nombre: entrega.Nombre}, { new: true}, (err, userDB)=>{
        if( err ) throw err;
        if( !userDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese Id'
            });
        }
    });
})

//Eliminar registros
entregaRoutes.post('/delete', (req: any, res: Response)=>{   
    const entrega ={
        _id: req.body._id || req.entrega._id
    };
    const id = entrega._id;
    Entrega.findByIdAndRemove(id).catch(err=>{
        console.log("error", err);
        
    });  
});

export default entregaRoutes;