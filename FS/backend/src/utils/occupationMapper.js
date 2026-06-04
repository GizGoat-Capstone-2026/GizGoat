/**
 * Mengubah nilai occupation dari format backend (database)
 * ke format yang diharapkan oleh AI Service model (TensorFlow).
 * 
 * Mapping:
 * - office_worker → "Office Worker"
 * - student       → "Education"
 * - field_worker  → "Sales"
 * - entrepreneur  → "Tech"
 * - healthcare    → "Medical"
 * - default       → "Office Worker"
 */
const mapOccupationToAI = (backendOccupation) => {
  if (!backendOccupation) return 'Office Worker';

  const occupationLower = backendOccupation.toLowerCase();

  switch (occupationLower) {
    case 'office_worker':
    case 'office worker':
      return 'Office Worker';
    case 'student':
    case 'education':
      return 'Education';
    case 'field_worker':
    case 'field worker':
    case 'sales':
      return 'Sales';
    case 'entrepreneur':
    case 'tech':
      return 'Tech';
    case 'healthcare':
    case 'medical':
      return 'Medical';
    default:
      return 'Office Worker';
  }
};

/**
 * Mengubah format gender backend ('male'/'female')
 * ke format AI Service ('Male'/'Female').
 */
const mapGenderToAI = (gender) => {
  if (!gender) return 'Male';
  
  const genderLower = gender.toLowerCase();
  if (genderLower === 'female') return 'Female';
  return 'Male';
};

module.exports = {
  mapOccupationToAI,
  mapGenderToAI,
};
