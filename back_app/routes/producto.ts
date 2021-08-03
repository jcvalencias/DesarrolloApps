import { Router, Request, Response } from "express";
import { Producto } from "../models/producto.model";

const productoRoutes = Router();

//Obtener registros
productoRoutes.get('/', async (req: any, res: Response)=>{
    const producto = await Producto.find().exec();
    res.json({
        ok: true,
        producto: producto 
    }); 
})

//crear registros
productoRoutes.post('/create', (req: Request, res: Response)=>{
    const producto ={        
        Nombre: req.body.Nombre,
        Maximo: req.body.Maximo,
        Minimo: req.body.Minimo
    };

    Producto.create( producto ).then( userDB =>{
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
productoRoutes.post('/update', (req: any, res: Response)=>{
    const producto ={
        Nombre: req.body.Nombre || req.producto.Nombre,
        Maximo: req.body.Maximo || req.producto.Maximo,
        Minimo: req.body.Minimo || req.producto.Minimo,
        _id: req.body._id || req.producto._id
    };
    const id = producto._id;
    Producto.findByIdAndUpdate(id, {Nombre: producto.Nombre, Maximo: producto.Maximo, Minimo: producto.Minimo}, { new: true}, (err, userDB)=>{
        if( err ) throw err;
        if( !userDB){
            return res.json({
                ok: false,
                mensaje: 'No existe un producto con ese Id'
            });
        }
    });
})

//Editar registros
productoRoutes.post('/delete', (req: any, res: Response)=>{
    const producto ={
        _id: req.body._id || req.producto._id
    };
    const id= producto._id;
    Producto.findByIdAndRemove(id).catch(err=>{
        console.log("error",err);
    });
});



export default productoRoutes;