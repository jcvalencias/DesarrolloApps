import { Schema, model, Document } from 'mongoose';

const estadoSchema = new Schema({
    Nombre: {
        type: Boolean,
        required: [true, 'El estado es necesario'],
    },
});

interface IEstado extends Document{
    Nombre: boolean;
}

export const Estado = model<IEstado>('Estados', estadoSchema);
