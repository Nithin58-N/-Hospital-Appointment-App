const Medicine = require('../models/Medicine');

/**
 * @desc    Search medicines
 * @route   GET /api/medicines/search
 * @access  Private
 */
const searchMedicines = async (req, res) => {
  try {
    const { q, category, limit = 20 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    let query = {
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { genericName: { $regex: q, $options: 'i' } }
      ]
    };

    if (category) {
      query.category = category;
    }

    const medicines = await Medicine.find(query)
      .select('name genericName category strength form manufacturer commonDosages commonFrequencies commonDurations')
      .limit(parseInt(limit))
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    console.error('Search medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching medicines',
      error: error.message
    });
  }
};

/**
 * @desc    Get all medicines
 * @route   GET /api/medicines
 * @access  Private
 */
const getAllMedicines = async (req, res) => {
  try {
    const { category, isActive = true, page = 1, limit = 50 } = req.query;

    let query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const medicines = await Medicine.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ name: 1 });

    const total = await Medicine.countDocuments(query);

    res.status(200).json({
      success: true,
      count: medicines.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: medicines
    });
  } catch (error) {
    console.error('Get all medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching medicines',
      error: error.message
    });
  }
};

/**
 * @desc    Get single medicine
 * @route   GET /api/medicines/:id
 * @access  Private
 */
const getMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error('Get medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching medicine',
      error: error.message
    });
  }
};

/**
 * @desc    Create medicine
 * @route   POST /api/medicines
 * @access  Private/Admin
 */
const createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Medicine created successfully',
      data: medicine
    });
  } catch (error) {
    console.error('Create medicine error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Medicine with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating medicine',
      error: error.message
    });
  }
};

/**
 * @desc    Update medicine
 * @route   PUT /api/medicines/:id
 * @access  Private/Admin
 */
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medicine updated successfully',
      data: medicine
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating medicine',
      error: error.message
    });
  }
};

/**
 * @desc    Delete medicine (soft delete)
 * @route   DELETE /api/medicines/:id
 * @access  Private/Admin
 */
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medicine deactivated successfully',
      data: medicine
    });
  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting medicine',
      error: error.message
    });
  }
};

module.exports = {
  searchMedicines,
  getAllMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine
};
