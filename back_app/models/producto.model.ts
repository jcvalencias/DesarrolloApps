import { Schema, model, Document } from 'mongoose';

const productoSchema = new Schema({
    Nombre: {
        type: String,
        required: [true, 'El nombre es necesaria'],
    },
    Maximo: {
        type: Number,
        required: [true, 'El precio maxímo es necesario'],
    },
    Minimo: {
        type: Number,
        required: [true, 'El precio minímo es necesario'],
    }
});

interface IProducto extends Document{
    Nombre: string;
    Maximo: number;
    Minimo: number;
}

export const Producto = model<IProducto>('Productos', productoSchema);
