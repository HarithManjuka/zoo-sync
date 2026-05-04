import Enclosure from '../models/Enclosure.js';
import { generateEnclosureId, isValidEnclosureId } from '../utils/enclosureIdGenerator.js';

// ============ CREATE ============
export const createEnclosure = async (req, res) => {
  try {
    const enclosureData = req.body;
    
    // Generate unique human-friendly ID
    enclosureData.enclosureId = await generateEnclosureId(
      enclosureData.climateType,
      enclosureData.type,
      Enclosure
    );
    
    // Set initial occupancy to 0
    enclosureData.currentOccupancy = 0;
    
    const enclosure = new Enclosure(enclosureData);
    await enclosure.save();
    
    res.status(201).json({
      success: true,
      message: 'Enclosure created successfully',
      data: enclosure
    });
  } catch (error) {
    console.error('Create enclosure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create enclosure',
      error: error.message
    });
  }
};

// ============ READ ============
export const getAllEnclosures = async (req, res) => {
  try {
    const { status, climateType, block, zone, search } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (climateType) query.climateType = climateType;
    if (block) query['location.block'] = block;
    if (zone) query['location.zone'] = zone;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { enclosureId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const enclosures = await Enclosure.find(query)
      .populate('currentAnimals', 'name species healthStatus')
      .sort({ enclosureId: 1 });
    
    res.status(200).json({
      success: true,
      count: enclosures.length,
      data: enclosures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enclosures',
      error: error.message
    });
  }
};

export const getEnclosureById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const enclosure = await Enclosure.findById(id)
      .populate('currentAnimals', 'name species age gender healthStatus profileImage');
    
    if (!enclosure) {
      return res.status(404).json({
        success: false,
        message: 'Enclosure not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: enclosure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enclosure',
      error: error.message
    });
  }
};

export const getEnclosureByEnclosureId = async (req, res) => {
  try {
    const { enclosureId } = req.params;
    
    const enclosure = await Enclosure.findOne({ enclosureId })
      .populate('currentAnimals', 'name species age gender healthStatus');
    
    if (!enclosure) {
      return res.status(404).json({
        success: false,
        message: 'Enclosure not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: enclosure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enclosure',
      error: error.message
    });
  }
};

// ============ UPDATE ============
export const updateEnclosure = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Prevent updating enclosureId and currentOccupancy manually
    delete updates.enclosureId;
    delete updates.currentOccupancy;
    
    const enclosure = await Enclosure.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!enclosure) {
      return res.status(404).json({
        success: false,
        message: 'Enclosure not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Enclosure updated successfully',
      data: enclosure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update enclosure',
      error: error.message
    });
  }
};

// ============ DELETE ============
export const deleteEnclosure = async (req, res) => {
  try {
    const { id } = req.params;
    
    const enclosure = await Enclosure.findById(id);
    
    if (!enclosure) {
      return res.status(404).json({
        success: false,
        message: 'Enclosure not found'
      });
    }
    
    // Prevent deletion if animals are present
    if (enclosure.currentOccupancy > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete enclosure with ${enclosure.currentOccupancy} animals. Transfer animals first.`
      });
    }
    
    await enclosure.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Enclosure deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete enclosure',
      error: error.message
    });
  }
};

// ============ MAINTENANCE ============
export const updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { safetyStatus, notes, nextMaintenance } = req.body;
    
    const enclosure = await Enclosure.findById(id);
    
    if (!enclosure) {
      return res.status(404).json({
        success: false,
        message: 'Enclosure not found'
      });
    }
    
    enclosure.maintenance.safetyStatus = safetyStatus || enclosure.maintenance.safetyStatus;
    enclosure.maintenance.lastInspection = new Date();
    if (notes) enclosure.maintenance.notes = notes;
    if (nextMaintenance) enclosure.maintenance.nextMaintenance = nextMaintenance;
    
    // Update status based on safety
    if (safetyStatus === 'danger') {
      enclosure.status = 'maintenance';
    }
    
    await enclosure.save();
    
    res.status(200).json({
      success: true,
      message: 'Maintenance status updated',
      data: enclosure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance',
      error: error.message
    });
  }
};

// ============ STATISTICS ============
export const getEnclosureStats = async (req, res) => {
  try {
    const totalEnclosures = await Enclosure.countDocuments();
    const availableEnclosures = await Enclosure.countDocuments({ status: 'available' });
    const maintenanceEnclosures = await Enclosure.countDocuments({ status: 'maintenance' });
    const totalCapacity = await Enclosure.aggregate([
      { $group: { _id: null, total: { $sum: '$capacity' } } }
    ]);
    const totalOccupancy = await Enclosure.aggregate([
      { $group: { _id: null, total: { $sum: '$currentOccupancy' } } }
    ]);
    
    const statsByClimate = await Enclosure.aggregate([
      { $group: { _id: '$climateType', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalEnclosures,
        availableEnclosures,
        maintenanceEnclosures,
        totalCapacity: totalCapacity[0]?.total || 0,
        totalOccupancy: totalOccupancy[0]?.total || 0,
        occupancyRate: totalCapacity[0]?.total 
          ? ((totalOccupancy[0]?.total / totalCapacity[0]?.total) * 100).toFixed(2)
          : 0,
        statsByClimate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};