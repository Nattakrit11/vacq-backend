const express = require('express');
const { 
  createReserve, 
  getReserve, 
  getReserveById, 
  updateReserve, 
  deleteReserve 
} = require('../controllers/reserve');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getReserve)
  .post(protect, authorize('admin'), createReserve);

router.route('/:id')
  .get(getReserveById)
  .put(protect, authorize('admin', 'user'), updateReserve)
  .delete(protect, authorize('admin', 'user'), deleteReserve);

module.exports = router;
