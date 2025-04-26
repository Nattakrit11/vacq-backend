const express = require('express');
const { 
  createReserveAppoint, 
  getAllreserveAppointments, 
  getreserveAppointmentById, 
  updateReserveAppoint, 
  deleteReserveAppoint, 
} = require('../controllers/reserveAppoint');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');


router.route('/').post(protect, authorize('admin', 'user'), createReserveAppoint);
// router.route('/').post(createReserveAppoint);


router.route('/').get(protect, authorize('admin'), getAllreserveAppointments);
// router.route('/').get(getAllAppointments);


router.route('/:id')
  .get(protect, authorize('admin', 'user'), getreserveAppointmentById)
  .put(protect, authorize('admin', 'user'), updateReserveAppoint)
  .delete(protect, authorize('admin', 'user'), deleteReserveAppoint);
  // .put(updateReserveAppoint)
  // .delete(deleteReserveAppoint);

module.exports = router;
