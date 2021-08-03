import { Schema, model, Document } from 'mongoose';

const mercadoSchema = new Schema({
    Nombre: {
        type: String,
        required: [true, 'El nombre es necesaria'],
    }
});

interface IMercado extends Document{
    Nombre: string;
}

export const Mercado = model<IMercado>('Mercados', mercadoSchema);
