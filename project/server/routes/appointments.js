import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
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
    
    // Check if date and time are available
    const existingAppointment = await Appointment.findOne({
      appointmentDate,
      appointmentTime,
      status: { $in: ['Scheduled', 'Confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please select another time.'
      });
    }
    
    // Create appointment
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

// @route   GET /api/appointments/myappointments
// @desc    Get logged in user's appointments
// @access  Private
router.get('/myappointments', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id });
    res.json(appointments);
  } catch (error) {
    console.error('Get my appointments error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get appointments'
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    // Check if the appointment belongs to the logged in user or if the user is an admin
    if (appointment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment'
      });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get appointment'
    });
  }
});

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel an appointment
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    // Check if the appointment belongs to the logged in user or if the user is an admin
    if (appointment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }
    
    // Check if appointment can be cancelled (not past or completed)
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    
    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel past appointments'
      });
    }
    
    if (appointment.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed appointments'
      });
    }
    
    // Update appointment
    appointment.status = 'Cancelled';
    
    const updatedAppointment = await appointment.save();
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel appointment'
    });
  }
});

// ADMIN ROUTES

// @route   GET /api/appointments
// @desc    Get all appointments
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const appointments = await Appointment.find({}).populate('user', 'name email');
    res.json(appointments);
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get appointments'
    });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    // Update appointment status
    appointment.status = status;
    
    const updatedAppointment = await appointment.save();
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update appointment status'
    });
  }
});

// @route   GET /api/appointments/available-slots
// @desc    Get available time slots for a date
// @access  Public
router.get('/available-slots/:date', async (req, res) => {
  try {
    const date = req.params.date;
    
    // Define all possible time slots
    const allTimeSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
      '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
    ];
    
    // Find appointments for the selected date
    const bookedAppointments = await Appointment.find({
      appointmentDate: date,
      status: { $in: ['Scheduled', 'Confirmed'] }
    });
    
    // Extract booked time slots
    const bookedTimeSlots = bookedAppointments.map(appointment => appointment.appointmentTime);
    
    // Filter available time slots
    const availableTimeSlots = allTimeSlots.filter(timeSlot => !bookedTimeSlots.includes(timeSlot));
    
    res.json({
      date,
      availableTimeSlots
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get available slots'
    });
  }
});

export default router;