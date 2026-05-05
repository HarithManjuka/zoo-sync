import mongoose from 'mongoose';

const AnimalSchema = new mongoose.Schema({
  // ========== BASIC INFORMATION ==========
  name: { 
    type: String, 
    required: [true, 'Animal name is required'],
    trim: true 
  },
  nickname: { 
    type: String, 
    trim: true 
  },
  species: { 
    type: String, 
    required: [true, 'Species is required'],
    trim: true,
    lowercase: true
  },
  scientificName: { 
    type: String, 
    trim: true 
  },
  
  // ========== PHYSICAL ATTRIBUTES ==========
  age: { 
    type: Number, 
    required: [true, 'Age is required'],
    min: 0,
    max: 200
  },
  weight: { 
    type: Number, 
    required: [true, 'Weight is required'],
    min: 0
  },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Unknown'],
    required: true 
  },
  
  // ========== ORIGIN ==========
  origin: { 
    type: String, 
    trim: true 
  },
  birthPlace: { 
    type: String, 
    enum: ['Wild', 'Captive Bred', 'Other Zoo', 'Rescue'],
    default: 'Captive Bred'
  },
  arrivalDate: { 
    type: Date, 
    default: Date.now 
  },
  
  // ========== ENCLOSURE RELATION ==========
  enclosure: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Enclosure',
    required: [true, 'Enclosure assignment is required']
  },
  
  // ========== STATUS TRACKING ==========
  status: { 
    type: String, 
    enum: ['Active', 'Quarantine', 'Treatment', 'Deceased', 'Transferred'],
    default: 'Active'
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  healthStatus: {
    type: String,
    enum: ['Healthy', 'Under Treatment', 'Critical', 'Recovering'],
    default: 'Healthy'
  },
  
  // ========== DIET & FEEDING ==========
  diet: { 
    type: String,
    trim: true 
  },
  dietType: {
    type: String,
    enum: ['Carnivore', 'Herbivore', 'Omnivore', 'Insectivore', 'Piscivore'],
    default: 'Omnivore'
  },
  feedingSchedule: { 
    type: String,
    trim: true 
  },
  feedingTimes: [{
    time: String,
    food: String,
    quantity: String
  }],
  
  // ========== STAFF ASSIGNMENTS ==========
  assignedZookeepers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zookeeper'
  }],
  primaryVeterinarian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Veterinarian'
  },
  
  // ========== QR CODE (For Visitor Feature) ==========
  qrCode: {
    url: { type: String },
    public_id: { type: String }
  },
  
  // ========== MEDIA ==========
  images: [{
    url: { type: String },
    public_id: { type: String },
    isPrimary: { type: Boolean, default: false },
    caption: { type: String }
  }],
  
  // ========== VISITOR INFORMATION (For QR Scan) ==========
  funFacts: [{
    type: String,
    trim: true
  }],
  animalSoundUrl: { type: String },
  videoUrl: { type: String },
  
  // ========== ADOPTION PROGRAM ==========
  isAdoptable: { type: Boolean, default: false },
  adoptionFee: { type: Number, min: 0 },
  adoptionSponsors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor'
  }],
  
  // ========== MEDICAL HISTORY REFERENCE ==========
  medicalRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  }],
  
  // ========== NOTES ==========
  behaviorNotes: { type: String },
  specialNeeds: { type: String },
  notes: { type: String }
  
}, {
  timestamps: true
});

// ========== INDEXES ==========
AnimalSchema.index({ name: 1 });
AnimalSchema.index({ species: 1 });
AnimalSchema.index({ enclosure: 1 });
AnimalSchema.index({ status: 1, isActive: 1 });
AnimalSchema.index({ species: 1, status: 1 });
AnimalSchema.index({ name: 'text', species: 'text', nickname: 'text' });

// ========== VIRTUAL FIELDS ==========
AnimalSchema.virtual('ageInYears').get(function() {
  return this.age;
});

// ========== INSTANCE METHODS ==========
AnimalSchema.methods.softDelete = async function() {
  this.isActive = false;
  this.status = 'Deceased';
  return this.save();
};

AnimalSchema.methods.transferToEnclosure = async function(newEnclosureId) {
  const oldEnclosureId = this.enclosure;
  this.enclosure = newEnclosureId;
  await this.save();
  return { oldEnclosureId, newEnclosureId: this.enclosure };
};

// ========== STATIC METHODS ==========
AnimalSchema.statics.getSpeciesList = async function() {
  return this.distinct('species', { isActive: true });
};

AnimalSchema.statics.getStatsBySpecies = async function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $group: {
      _id: '$species',
      count: { $sum: 1 },
      avgAge: { $avg: '$age' },
      avgWeight: { $avg: '$weight' }
    }},
    { $sort: { count: -1 } }
  ]);
};

// ========== PRE-SAVE HOOKS ==========
AnimalSchema.pre('save', function(next) {
  // Ensure species is lowercase for consistent querying
  if (this.species) {
    this.species = this.species.toLowerCase();
  }
  next();
});

const Animal = mongoose.model('Animal', AnimalSchema);
export default Animal;