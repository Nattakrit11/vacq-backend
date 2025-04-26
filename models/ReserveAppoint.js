const mongoose = require('mongoose');

const ReserveAppointSchema = new mongoose.Schema({
  reserve: {
    type: mongoose.Schema.ObjectId,
    ref: 'Reserve',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  time: {
    type: String,
    required: [true, 'Please add a time'],
    match: [
      /^([01][0-9]|2[0-3]):[0-5][0-9]\s*-\s*([01][0-9]|2[0-3]):[0-5][0-9]$/,
      'Please enter a valid time format (HH:MM - HH:MM)'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: Limit to 3 appointments per user (enforce in controller)
ReserveAppointSchema.index({ user: 1, date: 1 }, { unique: false });

module.exports = mongoose.model('ReserveAppoint', ReserveAppointSchema);
