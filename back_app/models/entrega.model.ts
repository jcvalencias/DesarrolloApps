import { Schema, model, Document } from 'mongoose';

const entregaSchema = new Schema({
    Nombre: {
        type: String,
        required: [true, 'El nombre es necesaria'],
    }
});

interface IEntrega extends Document{
    Nombre: string;
}

export const Entrega = model<IEntrega>('Entregas', entregaSchema);
