import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: [true, 'Please provide patient name'],
    trim: true
  },
  patientAge: {
    type: Number,
    required: [true, 'Please provide patient age'],
    min: [1, 'Age must be positive']
  },
  patientGender: {
    type: String,
    required: [true, 'Please provide patient gender'],
    enum: ['Male', 'Female', 'Other']
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    lowercase: true,
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please provide appointment date']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Please provide appointment time']
  },
  serviceType: {
    type: String,
    required: [true, 'Please provide service type'],
    enum: ['Comprehensive Eye Exam', 'Contact Lens Fitting', 'LASIK Consultation', 'Pediatric Eye Exam', 'Other']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  hasExistingPrescription: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-Show'],
    default: 'Scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;