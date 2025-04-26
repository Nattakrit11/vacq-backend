const mongoose = require('mongoose');

const ReserveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    maxlength: [100, 'Name must be less than 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
    maxlength: [255, 'Address must be less than 255 characters']
  },
  telephone: {
    type: String,
    required: [true, 'Please add a telephone number'],
    match: [
      /^[0-9]{10}$/,
      'Please enter a valid phone number',
    ],
  },
  hours: {
    type: String,
    required: [true, 'Please add the hours'],
    match: [
      /^([01][0-9]|2[0-3]):[0-5][0-9]\s*-\s*([01][0-9]|2[0-3]):[0-5][0-9]$/,
      'Please enter a valid time format (HH:MM - HH:MM)'
    ]
  },
  
});

module.exports = mongoose.model('Reserve', ReserveSchema);
