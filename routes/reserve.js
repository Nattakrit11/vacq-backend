const express = require('express');
const {getTickets, getTicket, addTicket, updateTicket, deleteTicket} = require('../controllers/reserve');

const router = express.Router({mergeParams:true});
const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .get(protect, getTickets)
    .post(protect, authorize('admin', 'user'), addTicket);

router.route('/:id')
    .get(protect, getTicket)
    .put(protect, authorize('admin', 'user'), updateTicket)
    .delete(protect, authorize('admin', 'user'), deleteTicket);

module.exports = router;