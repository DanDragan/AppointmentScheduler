import mongoose, { Schema, Document } from 'mongoose';

export interface Appointment extends Document {
    name: string;
    date: string;
    time: string;
}

const appointmentSchema: Schema = new Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true }
});

export const AppointmentModel = mongoose.model<Appointment>('Appointment', appointmentSchema);
