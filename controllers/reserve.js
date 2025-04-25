const Ticket = require('../models/Reserve');
const Hospital = require('../models/Hospital');

// @desc    Get all tickets
// @route   GET /api/v1/tickets
// @access  Private
exports.getTickets = async (req, res, next) => {
    let query;

    // General users can see only their tickets
    if (req.user.role !== 'admin') {
        query = Ticket.find({ user: req.user.id }).populate({
            path: 'hospital',
            select: 'name province tel'
        });
    } else {
        // If admin, can see all tickets or filter by hospital
        if (req.params.hospitalId) {
            query = Ticket.find({ hospital: req.params.hospitalId }).populate({
                path: 'hospital',
                select: 'name province tel'
            });
        } else {
            query = Ticket.find().populate({
                path: 'hospital',
                select: 'name province tel'
            });
        }
    }

    try {
        const tickets = await query;

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: "Cannot find Tickets" });
    }
};

// @desc    Get single ticket
// @route   GET /api/v1/tickets/:id
// @access  Private
exports.getTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate({
            path: 'hospital',
            select: 'name description tel'
        });

        if (!ticket) {
            return res.status(404).json({ success: false, message: `No ticket with the id of ${req.params.id}` });
        }

        // Make sure user is the ticket owner or admin
        if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to access this ticket' });
        }

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: "Cannot find Ticket" });
    }
};

// @desc    Create new ticket
// @route   POST /api/v1/hospitals/:hospitalId/tickets
// @access  Private
exports.addTicket = async (req, res, next) => {
    try {
        req.body.hospital = req.params.hospitalId;
        const hospital = await Hospital.findById(req.params.hospitalId);

        if (!hospital) {
            return res.status(404).json({ success: false, message: `No hospital with the id of ${req.params.hospitalId}` });
        }

        // Add user ID to request body
        req.body.user = req.user.id;

        const ticket = await Ticket.create(req.body);

        res.status(201).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: "Cannot create Ticket" });
    }
};

// @desc    Update ticket
// @route   PUT /api/v1/tickets/:id
// @access  Private
exports.updateTicket = async (req, res, next) => {
    try {
        let ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: `No ticket with the id of ${req.params.id}` });
        }

        // Make sure user is the ticket owner or admin
        if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false, 
                message: `User ${req.user.id} is not authorized to update this ticket`
            });
        }

        ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: "Cannot update Ticket" });
    }
};

// @desc    Delete ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private
exports.deleteTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: `No ticket with the id of ${req.params.id}` });
        }

        // Make sure user is the ticket owner or admin
        if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this ticket`
            });
        }

        await ticket.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: "Cannot delete Ticket" });
    }
};