import mongoose from 'mongoose';
import User from './User.js';

const ZookeeperSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  position: { 
    type: String, 
    enum: ['Chief Zookeeper', 'Senior Zookeeper', 'Zookeeper', 'Trainee'],
    default: 'Zookeeper'
  },
  specialization: [{
    type: String,
    enum: ['Mammals', 'Birds', 'Reptiles', 'Aquatic', 'Primates', 'Carnivores']
  }],
  assignedEnclosures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enclosure'
  }],
  hireDate: { type: Date, default: Date.now }
});

const Zookeeper = User.discriminator('Zookeeper', ZookeeperSchema);
export default Zookeeper;