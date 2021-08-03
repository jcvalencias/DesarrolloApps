import { Schema, model, Document } from 'mongoose';

const rondaSchema = new Schema({
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es necesaria'],
    },
    comentario: {
        type: String,
        default: '',
    },
    entrega: {
        type: String,
        required: [true, 'El lugar de entrega es necesario'],
    },
    fecha: {
        type: String,
        required: [true, 'La fecha es necesario'],
    },
    mercado: {
        type: String,
        required: [true, 'El mercado es necesario'],
    },
    peso: {
        type: Number,
        required: [true, 'El peso es necesario'],
    },
    precio: {
        type: Number,
        required: [true, 'El precio es necesario'],
    },
    ultimoDia: {
        type: String,
        default: '',
    },
    producto: {
        type: String,
        required: [true, 'El producto es necesario'],
    },
    semana: {
        type: Number,
        default: 0,
    },
    usuario:{
        type: String,
        default: '',
    },
    year:{
        type: Number,
        default: 0,
    },
});

interface IRonda extends Document{
    cantidad: number;
    comentario: string;
    entrega: string;
    fecha: string;
    mercado: string;
    peso: number;
    precio: number;
    producto: string;
    semana: number;
    ultimoDia: string;
    usuario: string;
    year: number;
}

export const Ronda = model<IRonda>('RondasHistoricas', rondaSchema);
