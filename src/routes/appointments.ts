import { Router, Request, Response } from 'express';
import { AppointmentModel } from '../models/appointment';

const router = Router();

// Get all appointments
router.get('/appointments', async (req: Request, res: Response) => {
    try {
        const appointments = await AppointmentModel.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

// Create a new appointment
router.post('/appointments', async (req: Request, res: Response) => {
    const { name, date, time } = req.body;

    // Check if the appointment time is valid (9 AM to 9 PM, Monday to Friday)
    const validTimes = Array.from({ length: 12 }, (_, i) => `${9 + i}:00`);
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.status(400).json({ message: 'Appointments are only available Monday to Friday' });
    }
    if (!validTimes.includes(time)) {
        return res.status(400).json({ message: 'Appointments are only available between 9:00 to 21:00' });
    }

    const newAppointment = new AppointmentModel({ name, date, time });
    try {
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error saving appointment' });
    }
});

// Delete an appointment
router.delete('/appointments/:id', async (req: Request, res: Response) => {
    try {
        const appointment = await AppointmentModel.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting appointment' });
    }
});

export default router;
