import { Router, Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { verificaToken } from "../middlewares/autenticación";

const userRoutes = Router();

//Login
userRoutes.post('/login', (req: Request, res: Response)=>{
    const body = req.body;
    Usuario.findOne({email: body.email}, (err: any, userDB: any)=>{        
        if( err ) throw err;
        if( !userDB ){
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        if(userDB.compararPassword( body.password) ){

            const tokenUser = Token.getJwtToken({
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
            });
        }else{
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos ****',
            })
        }        
    })
})

//obtener User
userRoutes.get('/', async (req: any, res: Response)=>{
    const users = await Usuario.find().exec();
    res.json({
        ok: true,
        users: users 
    });
})

userRoutes.post('/create', (req: Request, res: Response)=>{    
    const user ={
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        password: bcrypt.hashSync(req.body.password,10),
        celular: req.body.celular,
        email: req.body.email,
        localizacion: req.body.localizacion,
        idUsuario: req.body.idUsuario,
        codigoMostrar: req.body.codigoMostrar,
        estado: req.body.estado,
        pushUserId: req.body.pushUserId,
        granja: req.body.granja,
    };
    Usuario.create( user ).then( userDB =>{
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

//Actualizar usuario
//userRoutes.post('/update', verificaToken, (req: any, res: Response)=>{
userRoutes.post('/update', (req: any, res: Response)=>{
    const user ={
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
    Usuario.findByIdAndUpdate(id,user, { new: true}, (err, userDB)=>{     
        if( err ) throw err;
        if( !userDB){
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

export default userRoutes;