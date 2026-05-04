// Generate human-friendly enclosure IDs
// Examples: MAM-001, AQU-002, DES-003, ARC-004

const climatePrefixes = {
  tropical: 'TRO',
  desert: 'DES',
  arctic: 'ARC',
  aquatic: 'AQU',
  temperate: 'TEM',
  savanna: 'SAV'
};

const typePrefixes = {
  'Open': 'OPN',
  'Glass House': 'GLH',
  'Cage': 'CAG',
  'Aquarium': 'AQU',
  'Aviary': 'AVI',
  'Night House': 'NHT'
};

export const generateEnclosureId = async (climateType, type, EnclosureModel) => {
  const prefix = climatePrefixes[climateType] || typePrefixes[type] || 'ENC';
  
  // Find the highest number for this prefix
  const lastEnclosure = await EnclosureModel.findOne({
    enclosureId: { $regex: `^${prefix}-`, $options: 'i' }
  }).sort({ enclosureId: -1 });
  
  let nextNumber = 1;
  if (lastEnclosure) {
    const lastNumber = parseInt(lastEnclosure.enclosureId.split('-')[1]);
    nextNumber = lastNumber + 1;
  }
  
  return `${prefix}-${String(nextNumber).padStart(3, '0')}`;
};

// Validate enclosure ID format
export const isValidEnclosureId = (enclosureId) => {
  const pattern = /^[A-Z]{3}-\d{3}$/;
  return pattern.test(enclosureId);
};