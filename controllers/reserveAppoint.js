const ReserveAppoint = require('../models/ReserveAppoint');

exports.createReserveAppoint = async (req, res) => {
  try {
    const { date, time, reserveId } = req.body;
    const userId = req.user.id;

    const appointmentUserId = req.user.role === 'admin' ? req.body.userId || userId : userId;

    // Check 3 reserve
    const existingAppointments = await ReserveAppoint.find({ user: appointmentUserId });
    if (existingAppointments.length >= 3 && req.user.role !== 'admin' ) {
      return res.status(400).json({
        success: false,
        message: ` The user with ID ${req.user.id} has already made 3 reserve`,
      });
    }

    // Create the appointment
    const appointment = await ReserveAppoint.create({
      user: appointmentUserId,
      date,
      time,
      reserve: reserveId,
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


// Get all appointments (only for admin)
exports.getAllreserveAppointments = async (req, res) => {
  try {
    // Only admin can access all appointments
    if (req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to access all appointments',
      });
    }

    const appointments = await ReserveAppoint.find().populate('reserve');
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get a single appointment by ID
exports.getreserveAppointmentById = async (req, res) => {
  try {
    const appointment = await ReserveAppoint.findById(req.params.id).populate('reserve');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if the user is the creator of the appointment or admin
    if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to view this appointment',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update an appointment (Only allowed for the user who created it or admin)
exports.updateReserveAppoint = async (req, res) => {
  try {
    const appointment = await ReserveAppoint.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if the user is the creator of the appointment or admin
    if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to update this appointment',
      });
    }

    // Update appointment details
    appointment.date = req.body.date || appointment.date;
    appointment.time = req.body.time || appointment.time;

    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete an appointment (Only allowed for the user who created it or admin)
exports.deleteReserveAppoint = async (req, res) => {
  try {
    const appointment = await ReserveAppoint.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if the user is the creator of the appointment or admin
    if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to delete this appointment',
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Appointment deleted',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};




// const ReserveAppoint = require('../models/ReserveAppoint');
// const Reserve = require('../models/Reserve');

// // @desc Get all reserve appointments
// // @route GET /api/v1/reserveappoint
// // @access Private
// exports.getAllAppointments = async (req, res) => {
//   let query;

//   if (req.user.role !== 'admin') {
//     query = ReserveAppoint.find({ user: req.user.id }).populate({
//       path: 'reserve',
//       select: 'name address telephone hours'
//     });
//   } else {
//     if (req.params.reserveId) {
//       query = ReserveAppoint.find({ reserve: req.params.reserveId }).populate({
//         path: 'reserve',
//         select: 'name address telephone hours'
//       });
//     } else {
//       query = ReserveAppoint.find().populate({
//         path: 'reserve',
//         select: 'name address telephone hours'
//       });
//     }
//   }

//   try {
//     const appointments = await query;
//     res.status(200).json({
//       success: true,
//       count: appointments.length,
//       data: appointments,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Cannot get appointments' });
//   }
// };

// // @desc Get single appointment
// // @route GET /api/v1/reserveappoint/:id
// // @access Private
// exports.getAppointmentById = async (req, res) => {
//   try {
//     const appointment = await ReserveAppoint.findById(req.params.id).populate({
//       path: 'reserve',
//       select: 'name address telephone hours'
//     });

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: `No appointment with ID ${req.params.id}`,
//       });
//     }

//     res.status(200).json({ success: true, data: appointment });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Cannot get appointment' });
//   }
// };

// // @desc Add appointment
// // @route POST /api/v1/reserve/:reserveId/reserveappoint
// // @access Private
// exports.createReserveAppoint = async (req, res) => {
//   try {
//     req.body.reserve = req.params.reserve._Id;

//     const reserve = await Reserve.findById(req.params.reserve._Id);
//     if (!reserve) {
//       return res.status(404).json({
//         success: false,
//         message: `No massage shop found with ID ${req.params.reserveId}`,
//       });
//     }

//     req.body.user = req.user.id;

//     const existingAppointments = await ReserveAppoint.find({ user: req.user.id });
//     if (existingAppointments.length >= 3 && req.user.role !== 'admin') {
//       return res.status(400).json({
//         success: false,
//         message: `User with ID ${req.user.id} has already made 3 appointments`,
//       });
//     }

//     const appointment = await ReserveAppoint.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: appointment,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Cannot create appointment' });
//   }
// };

// // @desc Update appointment
// // @route PUT /api/v1/reserveappoint/:id
// // @access Private
// exports.updateReserveAppoint = async (req, res) => {
//   try {
//     let appointment = await ReserveAppoint.findById(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }

//     if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
//       return res.status(401).json({
//         success: false,
//         message: `User ${req.user.id} not authorized to update this appointment`,
//       });
//     }

//     appointment = await ReserveAppoint.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });

//     res.status(200).json({
//       success: true,
//       data: appointment,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Cannot update appointment' });
//   }
// };

// // @desc Delete appointment
// // @route DELETE /api/v1/reserveappoint/:id
// // @access Private
// exports.deleteReserveAppoint = async (req, res) => {
//   try {
//     const appointment = await ReserveAppoint.findById(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }

//     if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
//       return res.status(401).json({
//         success: false,
//         message: `User ${req.user.id} not authorized to delete this appointment`,
//       });
//     }

//     await appointment.deleteOne();

//     res.status(200).json({
//       success: true,
//       data: {},
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Cannot delete appointment' });
//   }
// };

