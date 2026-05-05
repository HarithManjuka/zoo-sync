import Animal from '../modules/Animal.js';
import Enclosure from '../modules/Enclosure.js';
import mongoose from 'mongoose';

// ========== HELPER FUNCTIONS ==========
const removeLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ========== CREATE ANIMAL ==========
export const createAnimal = async (req, res) => {
  try {
    const animalData = req.body;
    
    // Check if enclosure exists
    const enclosure = await Enclosure.findById(animalData.enclosure);
    if (!enclosure) {
      return res.status(404).json({
        success: false,
        message: 'Enclosure not found'
      });
    }
    
    // Check if enclosure can accommodate this animal
    if (!enclosure.canAddAnimal(animalData.species)) {
      return res.status(400).json({
        success: false,
        message: `Enclosure cannot accommodate ${animalData.species}. Suitable for: ${enclosure.suitableFor.join(', ')}`
      });
    }
    
    // Create animal
    const animal = new Animal(animalData);
    await animal.save();
    
    // Update enclosure occupancy
    await enclosure.addAnimal(animal._id, animal.species);
    
    res.status(201).json({
      success: true,
      message: 'Animal created successfully',
      data: animal
    });
  } catch (error) {
    console.error('Create animal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create animal',
      error: error.message
    });
  }
};

// ========== GET ALL ANIMALS (with filters) ==========
export const getAllAnimals = async (req, res) => {
  try {
    const { 
      species, 
      status, 
      healthStatus, 
      enclosureId,
      gender,
      isActive,
      search,
      page = 1,
      limit = 20
    } = req.query;
    
    let query = {};
    
    if (species) query.species = species.toLowerCase();
    if (status) query.status = status;
    if (healthStatus) query.healthStatus = healthStatus;
    if (enclosureId) query.enclosure = enclosureId;
    if (gender) query.gender = gender;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { species: { $regex: search, $options: 'i' } },
        { nickname: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [animals, total] = await Promise.all([
      Animal.find(query)
        .populate('enclosure', 'name enclosureId status')
        .populate('assignedZookeepers', 'fullName employeeId')
        .populate('primaryVeterinarian', 'fullName employeeId specialization')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Animal.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      count: animals.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: animals
    });
  } catch (error) {
    console.error('Get animals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch animals',
      error: error.message
    });
  }
};

// ========== GET SINGLE ANIMAL ==========
export const getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const animal = await Animal.findById(id)
      .populate('enclosure', 'name enclosureId climateType status capacity currentOccupancy')
      .populate('assignedZookeepers', 'fullName employeeId position specialization')
      .populate('primaryVeterinarian', 'fullName employeeId licenseNumber specialization')
      .populate('medicalRecords', 'date diagnosis treatment status');
    
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: animal
    });
  } catch (error) {
    console.error('Get animal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch animal',
      error: error.message
    });
  }
};

// ========== UPDATE ANIMAL ==========
export const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    // Handle enclosure change
    if (updates.enclosure && updates.enclosure !== animal.enclosure.toString()) {
      const newEnclosure = await Enclosure.findById(updates.enclosure);
      if (!newEnclosure) {
        return res.status(404).json({
          success: false,
          message: 'New enclosure not found'
        });
      }
      
      const species = updates.species || animal.species;
      if (!newEnclosure.canAddAnimal(species)) {
        return res.status(400).json({
          success: false,
          message: `New enclosure cannot accommodate ${species}`
        });
      }
      
      // Remove from old enclosure
      const oldEnclosure = await Enclosure.findById(animal.enclosure);
      await oldEnclosure.removeAnimal(animal._id);
      
      // Add to new enclosure
      await newEnclosure.addAnimal(animal._id, species);
    }
    
    // Update fields
    Object.keys(updates).forEach(key => {
      if (key !== 'enclosure') {
        animal[key] = updates[key];
      }
    });
    
    await animal.save();
    
    res.status(200).json({
      success: true,
      message: 'Animal updated successfully',
      data: animal
    });
  } catch (error) {
    console.error('Update animal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update animal',
      error: error.message
    });
  }
};

// ========== DELETE ANIMAL (Soft Delete) ==========
export const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    // Remove from enclosure
    const enclosure = await Enclosure.findById(animal.enclosure);
    if (enclosure) {
      await enclosure.removeAnimal(animal._id);
    }
    
    // Soft delete
    animal.isActive = false;
    animal.status = 'Deceased';
    await animal.save();
    
    res.status(200).json({
      success: true,
      message: 'Animal archived successfully'
    });
  } catch (error) {
    console.error('Delete animal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete animal',
      error: error.message
    });
  }
};

// ========== HARD DELETE (Admin only) ==========
export const hardDeleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    // Remove from enclosure
    const enclosure = await Enclosure.findById(animal.enclosure);
    if (enclosure) {
      await enclosure.removeAnimal(animal._id);
    }
    
    await animal.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Animal permanently deleted'
    });
  } catch (error) {
    console.error('Hard delete animal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete animal',
      error: error.message
    });
  }
};

// ========== TRANSFER ANIMAL ==========
export const transferAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { newEnclosureId } = req.body;
    
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    const newEnclosure = await Enclosure.findById(newEnclosureId);
    if (!newEnclosure) {
      return res.status(404).json({
        success: false,
        message: 'New enclosure not found'
      });
    }
    
    // Check compatibility
    if (!newEnclosure.canAddAnimal(animal.species)) {
      return res.status(400).json({
        success: false,
        message: `Enclosure cannot accommodate ${animal.species}. Suitable for: ${newEnclosure.suitableFor.join(', ')}`
      });
    }
    
    // Remove from old enclosure
    const oldEnclosure = await Enclosure.findById(animal.enclosure);
    await oldEnclosure.removeAnimal(animal._id);
    
    // Add to new enclosure
    await newEnclosure.addAnimal(animal._id, animal.species);
    
    // Update animal
    animal.enclosure = newEnclosureId;
    await animal.save();
    
    res.status(200).json({
      success: true,
      message: `Animal transferred from ${oldEnclosure.name} to ${newEnclosure.name}`,
      data: animal
    });
  } catch (error) {
    console.error('Transfer animal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transfer animal',
      error: error.message
    });
  }
};

// ========== UPDATE HEALTH STATUS ==========
export const updateHealthStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { healthStatus, status, notes } = req.body;
    
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    if (healthStatus) animal.healthStatus = healthStatus;
    if (status) animal.status = status;
    if (notes) animal.notes = notes;
    
    await animal.save();
    
    res.status(200).json({
      success: true,
      message: 'Health status updated',
      data: animal
    });
  } catch (error) {
    console.error('Update health error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update health status',
      error: error.message
    });
  }
};

// ========== GET ANIMALS BY ENCLOSURE ==========
export const getAnimalsByEnclosure = async (req, res) => {
  try {
    const { enclosureId } = req.params;
    
    const animals = await Animal.find({ 
      enclosure: enclosureId, 
      isActive: true 
    }).populate('assignedZookeepers', 'fullName');
    
    res.status(200).json({
      success: true,
      count: animals.length,
      data: animals
    });
  } catch (error) {
    console.error('Get animals by enclosure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch animals',
      error: error.message
    });
  }
};

// ========== GET SPECIES LIST ==========
export const getSpeciesList = async (req, res) => {
  try {
    const species = await Animal.getSpeciesList();
    
    res.status(200).json({
      success: true,
      count: species.length,
      data: species
    });
  } catch (error) {
    console.error('Get species list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch species list',
      error: error.message
    });
  }
};

// ========== GET STATISTICS ==========
export const getAnimalStats = async (req, res) => {
  try {
    const [
      totalAnimals,
      activeAnimals,
      bySpecies,
      byHealthStatus,
      byGender
    ] = await Promise.all([
      Animal.countDocuments(),
      Animal.countDocuments({ isActive: true }),
      Animal.getStatsBySpecies(),
      Animal.aggregate([
        { $group: { _id: '$healthStatus', count: { $sum: 1 } } }
      ]),
      Animal.aggregate([
        { $group: { _id: '$gender', count: { $sum: 1 } } }
      ])
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalAnimals,
        activeAnimals,
        bySpecies,
        byHealthStatus,
        byGender
      }
    });
  } catch (error) {
    console.error('Get animal stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// ========== PUBLIC ENDPOINT (For Visitor QR Scan) ==========
export const getAnimalForQR = async (req, res) => {
  try {
    const { id } = req.params;
    
    const animal = await Animal.findById(id)
      .select('name nickname species scientificName age weight gender origin diet funFacts healthStatus status images enclosure')
      .populate('enclosure', 'name climateType visitorAccessible viewingHours');
    
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: animal
    });
  } catch (error) {
    console.error('QR animal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch animal data',
      error: error.message
    });
  }
};