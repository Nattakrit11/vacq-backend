const Reserve = require("../models/Reserve");

// @desc    Get all reserve shops
// @route   GET /api/v1/reserve
// @access  Public
exports.getReserve = async (req, res, next) => {
  try {
    const reserves = await Reserve.find();
    res.status(200).json({
      success: true,
      count: reserves.length,
      data: reserves,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Cannot get reserve data",
    });
  }
};

// @desc    Get a single reserve shop by ID
// @route   GET /api/v1/reserve/:id
// @access  Public
exports.getReserveById = async (req, res, next) => {
  try {
    const reserve = await Reserve.findById(req.params.id);

    if (!reserve) {
      return res.status(404).json({
        success: false,
        message: `No reserve shop found with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: reserve,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create a new reserve shop
// @route   POST /api/v1/reserve
// @access  Public
exports.createReserve = async (req, res, next) => {
  const { name, address, telephone, hours } = req.body;

  try {
    const reserve = await Reserve.create({
      name,
      address,
      telephone,
      hours,
    });

    res.status(201).json({
      success: true,
      data: reserve,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Cannot create reserve shop",
    });
  }
};

// @desc    Update a reserve shop by ID
// @route   PUT /api/v1/reserve/:id
// @access  Private (only admin or owner can update)
exports.updateReserve = async (req, res, next) => {
  try {
    let reserve = await Reserve.findById(req.params.id);

    if (!reserve) {
      return res.status(404).json({
        success: false,
        message: `No reserve shop found with the id of ${req.params.id}`,
      });
    }

    // Update the reserve shop
    reserve = await Reserve.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: reserve,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Cannot update reserve shop",
    });
  }
};

// @desc    Delete a reserve shop by ID
// @route   DELETE /api/v1/reserve/:id
// @access  Private (only admin or owner can delete)
exports.deleteReserve = async (req, res, next) => {
  try {
    const reserve = await Reserve.findById(req.params.id);

    if (!reserve) {
      return res.status(404).json({
        success: false,
        message: `No reserve shop found with the id of ${req.params.id}`,
      });
    }

    // Delete the reserve shop
    await reserve.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Cannot delete reserve shop",
    });
  }
};
