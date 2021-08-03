import { Router, Request, Response } from "express";
import { Estado } from "../models/estado.model";

const estadoRoutes = Router();

//Obtener registros
estadoRoutes.get('/', async (req: any, res: Response)=>{
    const estado = await Estado.find().exec();
    res.json({
        ok: true,
        estado: estado 
    }); 
})

//crear registros
estadoRoutes.post('/create', (req: Request, res: Response)=>{
    const estado ={        
        Nombre: req.body.Nombre,
    };

    Estado.create( estado ).then( userDB =>{
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
estadoRoutes.post('/update', (req: any, res: Response)=>{
    const estado ={
        Nombre: req.body.Nombre,
        _id: req.body._id || req.estado._id
    };
    const id = estado._id;    
    Estado.findByIdAndUpdate(id, estado, { new: true}, (err, userDB)=>{
        if( err ) throw err;
        if( !userDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un estado con ese Id'
            });
        }
    });
});

export default estadoRoutes;