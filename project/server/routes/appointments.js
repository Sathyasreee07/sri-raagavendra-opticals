import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/* =========================================
   CREATE APPOINTMENT
========================================= */
router.post('/', protect, async (req, res) => {
  try {
    const {
      patientName,
      patientAge,
      patientGender,
      phone,
      email,
      appointmentDate,
      appointmentTime,
      serviceType,
      notes,
      hasExistingPrescription
    } = req.body;

    // Check slot availability
    const existingAppointment = await Appointment.findOne({
      appointmentDate,
      appointmentTime,
      status: { $in: ['Scheduled', 'Confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const appointment = new Appointment({
      user: req.user._id,
      patientName,
      patientAge,
      patientGender,
      phone,
      email,
      appointmentDate,
      appointmentTime,
      serviceType,
      notes,
      hasExistingPrescription
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);

  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create appointment'
    });
  }
});

/* =========================================
   GET LOGGED-IN USER APPOINTMENTS
========================================= */
router.get('/myappointments', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    console.error('Get my appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments'
    });
  }
});

/* =========================================
   AVAILABLE SLOTS (PUBLIC)
   ⚠️ MUST BE ABOVE /:id
========================================= */
router.get('/available-slots/:date', async (req, res) => {
  try {
    const date = req.params.date;

    const allTimeSlots = [
      '09:00 AM','09:30 AM','10:00 AM','10:30 AM',
      '11:00 AM','11:30 AM','12:00 PM','12:30 PM',
      '02:00 PM','02:30 PM','03:00 PM','03:30 PM',
      '04:00 PM','04:30 PM','05:00 PM','05:30 PM'
    ];

    const bookedAppointments = await Appointment.find({
      appointmentDate: date,
      status: { $in: ['Scheduled', 'Confirmed'] }
    });

    const bookedSlots = bookedAppointments.map(a => a.appointmentTime);

    const availableTimeSlots = allTimeSlots.filter(
      slot => !bookedSlots.includes(slot)
    );

    res.json({ date, availableTimeSlots });
  } catch (error) {
    console.error('Available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available slots'
    });
  }
});

/* =========================================
   GET APPOINTMENT BY ID
========================================= */
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (
      appointment.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Failed to get appointment' });
  }
});

/* =========================================
   CANCEL APPOINTMENT
========================================= */
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (
      appointment.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const appointmentDate = new Date(appointment.appointmentDate);
    appointmentDate.setHours(0,0,0,0);

    const today = new Date();
    today.setHours(0,0,0,0);

    if (appointmentDate < today || appointment.status === 'Completed') {
      return res.status(400).json({
        message: 'Cannot cancel this appointment'
      });
    }

    appointment.status = 'Cancelled';
    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
});

/* =========================================
   ADMIN: GET ALL APPOINTMENTS
========================================= */
router.get('/', protect, admin, async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('user', 'name email')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Admin get appointments error:', error);
    res.status(500).json({ message: 'Failed to get appointments' });
  }
});

/* =========================================
   ADMIN: UPDATE STATUS
========================================= */
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ['Scheduled','Confirmed','Completed','Cancelled'];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

export default router;
