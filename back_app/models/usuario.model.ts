import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


const usuarioSchema: Schema<IUsuario> = new Schema({
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
    password:{
        type: String,
        required: [true, 'La contraseña es necesario'],
    },
    celular:{
        type: Number,
        required: [true, 'El celular es necesario'],
    },
    granja:{
        type: String,
        required: [true, 'La granja es necesaria'],
    },
    localizacion:{
        type: String,
        required: [true, 'La localización es necesaria'],
    },
    estado:{
        type: Boolean,
        default: false,
    },
    idUsuario:{
        type: String,
        default: '',
    },
    codigoMostrar:{
        type: String,
        default: '',
    },
    pushUserId:{
        type: String,
        default: '',
    },
});

usuarioSchema.method('compararPassword', function( password1: string = ''): boolean{
    if( bcrypt.compareSync( password1, this.password)){
        return true;
    }else{
        return false;
    }
});

interface IUsuario extends Document{
    nombre: string;
    apellido: string;
    password: string;
    celular: string;
    email: string;
    localizacion: string;
    idUsuario: string;
    codigoMostrar: string;
    estado: boolean;
    pushUserId: string;
    granja: string;
    compararPassword(password: string): boolean;
}

export const Usuario = model<IUsuario>('Usuarios', usuarioSchema);