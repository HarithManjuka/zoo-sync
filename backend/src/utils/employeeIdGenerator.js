/**
 * Employee ID Generator
 * Generates unique employee IDs based on role
 * Format: PREFIX + Sequential Number (3 digits)
 * Examples: ADM001, ZK001, VET001, VEM001, INV001
 */

const rolePrefixes = {
  Admin: 'ADM',
  Zookeeper: 'ZK',
  Veterinarian: 'VET',
  VisitorExperienceManager: 'VEM',
  InventoryManager: 'INV',
  // Visitor doesn't get employee ID
};

/**
 * Generate next employee ID for a specific role
 * @param {string} role - User role (Admin, Zookeeper, etc.)
 * @param {object} model - Mongoose model to query (Admin, Zookeeper, etc.)
 * @returns {Promise<string>} - Generated employee ID
 */
export const generateEmployeeId = async (role, model) => {
  // Visitor doesn't need employee ID
  if (role === 'Visitor') {
    return null;
  }
  
  const prefix = rolePrefixes[role];
  if (!prefix) {
    throw new Error(`Unknown role: ${role}`);
  }
  
  // Find the highest employee ID for this role
  const lastEmployee = await model.findOne(
    { employeeId: { $regex: `^${prefix}`, $options: 'i' } },
    { employeeId: 1 }
  ).sort({ employeeId: -1 });
  
  let nextNumber = 1;
  if (lastEmployee && lastEmployee.employeeId) {
    const match = lastEmployee.employeeId.match(new RegExp(`^${prefix}(\\d+)$`, 'i'));
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }
  
  // Format: PREFIX + 3-digit number (e.g., ADM001, ZK099, VET999)
  return `${prefix}${String(nextNumber).padStart(3, '0')}`;
};

/**
 * Generate license number for Veterinarian
 * Format: LIC + 6-digit number
 * @param {object} model - Veterinarian model
 * @returns {Promise<string>}
 */
export const generateLicenseNumber = async (model) => {
  const lastVet = await model.findOne(
    { licenseNumber: { $regex: '^LIC', $options: 'i' } },
    { licenseNumber: 1 }
  ).sort({ licenseNumber: -1 });
  
  let nextNumber = 1;
  if (lastVet && lastVet.licenseNumber) {
    const match = lastVet.licenseNumber.match(/^LIC(\d+)$/i);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }
  
  return `LIC${String(nextNumber).padStart(6, '0')}`;
};

/**
 * Validate employee ID format
 * @param {string} employeeId - Employee ID to validate
 * @returns {boolean}
 */
export const isValidEmployeeId = (employeeId) => {
  const pattern = /^(ADM|ZK|VET|VEM|INV)\d{3}$/i;
  return pattern.test(employeeId);
};

/**
 * Get role from employee ID prefix
 * @param {string} employeeId - Employee ID
 * @returns {string|null} - Role name or null
 */
export const getRoleFromEmployeeId = (employeeId) => {
  const prefix = employeeId.slice(0, 3).toUpperCase();
  const roleMap = {
    'ADM': 'Admin',
    'ZK': 'Zookeeper',
    'VET': 'Veterinarian',
    'VEM': 'VisitorExperienceManager',
    'INV': 'InventoryManager'
  };
  return roleMap[prefix] || null;
};

export default generateEmployeeId;