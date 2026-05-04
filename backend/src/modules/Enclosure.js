import mongoose from 'mongoose';

const EnclosureSchema = new mongoose.Schema({
  // Human-friendly unique ID (e.g., "MAM-001", "AQU-002")
  enclosureId: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  
  // Basic Information
  name: { type: String, required: true, trim: true }, // e.g., "Lion Kingdom"
  type: { 
    type: String, 
    enum: ['Open', 'Glass House', 'Cage', 'Aquarium', 'Aviary', 'Night House'],
    required: true 
  },
  
  // Capacity Management
  capacity: { 
    type: Number, 
    required: true, 
    min: 1,
    default: 1
  },
  currentOccupancy: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  // Location Information
  location: {
    address: { type: String },  // e.g., "North Zone, Area A"
    latitude: { type: Number },
    longitude: { type: Number },
    block: { type: String },      // e.g., "Block A", "Block B"
    zone: { type: String }        // e.g., "African Safari", "Asian Rainforest"
  },
  
  // Status Management
  status: { 
    type: String, 
    enum: ['available', 'assigned', 'unavailable', 'maintenance'],
    default: 'available'
  },
  
  // Climate & Environment
  climateType: { 
    type: String, 
    enum: ['tropical', 'desert', 'arctic', 'aquatic', 'temperate', 'savanna'],
    required: true 
  },
  temperature: {
    min: { type: Number },
    max: { type: Number },
    current: { type: Number }
  },
  humidity: { type: Number }, // percentage
  
  // Animal Relation (for which species this enclosure is designed for)
  suitableFor: [{
    type: String,  // Species names like "Lion", "Elephant", "Penguin"
    lowercase: true
  }],
  currentAnimals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal'
  }],
  
  // Maintenance & Safety
  maintenance: {
    safetyStatus: { 
      type: String, 
      enum: ['safe', 'warning', 'danger'],
      default: 'safe'
    },
    lastCleaned: { type: Date, default: Date.now },
    lastInspection: { type: Date, default: Date.now },
    nextMaintenance: { type: Date },
    notes: { type: String }
  },
  
  // Facilities & Amenities
  facilities: {
    feedingArea: { type: Boolean, default: true },
    waterSource: { 
      type: String, 
      enum: ['Natural', 'Artificial', 'Both'],
      default: 'Artificial'
    },
    swimmingPool: { type: Boolean, default: false },
    shadeStructure: { type: Boolean, default: true },
    nightLights: { type: Boolean, default: false }
  },
  
  // Visitor Information
  visitorAccessible: { type: Boolean, default: true },
  viewingHours: {
    open: { type: String, default: '09:00' },   // 24hr format
    close: { type: String, default: '17:00' }
  },
  visitorTips: { type: String },
  
  // Special Notes
  specialNotes: { type: String },
  
  // Emergency Procedures
  emergencyProtocol: { type: String },
  
  // Images/Media
  images: [{
    url: String,
    public_id: String,
    caption: String
  }]
  
}, {
  timestamps: true
});

// Indexes for better query performance
EnclosureSchema.index({ enclosureId: 1 });
EnclosureSchema.index({ status: 1, isActive: 1 });
EnclosureSchema.index({ 'location.block': 1 });
EnclosureSchema.index({ climateType: 1 });
EnclosureSchema.index({ suitableFor: 1 });

// Virtual for occupancy percentage
EnclosureSchema.virtual('occupancyPercentage').get(function() {
  if (this.capacity === 0) return 0;
  return (this.currentOccupancy / this.capacity) * 100;
});

// Method to check if animal can be added
EnclosureSchema.methods.canAddAnimal = function(animalSpecies) {
  return this.status === 'available' && 
         this.currentOccupancy < this.capacity &&
         this.suitableFor.includes(animalSpecies.toLowerCase());
};

// Method to add animal
EnclosureSchema.methods.addAnimal = async function(animalId, animalSpecies) {
  if (!this.canAddAnimal(animalSpecies)) {
    throw new Error('Cannot add animal to this enclosure');
  }
  
  this.currentOccupancy += 1;
  this.currentAnimals.push(animalId);
  
  // Auto-update status if full
  if (this.currentOccupancy >= this.capacity) {
    this.status = 'assigned';
  }
  
  return this.save();
};

// Method to remove animal
EnclosureSchema.methods.removeAnimal = async function(animalId) {
  this.currentOccupancy -= 1;
  this.currentAnimals = this.currentAnimals.filter(id => id.toString() !== animalId.toString());
  
  // Update status if below capacity
  if (this.currentOccupancy < this.capacity && this.status === 'assigned') {
    this.status = 'available';
  }
  
  return this.save();
};

// Ensure currentOccupancy never exceeds capacity
EnclosureSchema.pre('save', function(next) {
  if (this.currentOccupancy > this.capacity) {
    next(new Error('Current occupancy cannot exceed capacity'));
  }
  next();
});

const Enclosure = mongoose.model('Enclosure', EnclosureSchema);
export default Enclosure;