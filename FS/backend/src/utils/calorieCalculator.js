/**
 * Calorie Calculator Utility
 * Calculates BMR (Mifflin-St Jeor) and TDEE based on user profile.
 */

const ACTIVITY_FACTORS = {
  'office_worker': 1.2,       // Sedentary (duduk hampir seharian)
  'student': 1.375,           // Lightly active
  'entrepreneur': 1.375,      // Lightly active
  'healthcare': 1.55,         // Moderately active
  'field_worker': 1.725,      // Very active
  'other': 1.55               // Default (Moderately active)
};

/**
 * Menghitung target kalori harian (TDEE) pengguna
 * @param {Object} user - Objek user (age, gender, weight, height, occupation)
 * @returns {number} Target kalori harian (kkal)
 */
const calculateDailyCalorieTarget = (user) => {
  // Return custom daily calorie target if set
  if (user && user.dailyCalorieTarget && user.dailyCalorieTarget > 0) {
    return user.dailyCalorieTarget;
  }

  // Fallback jika profil belum lengkap
  if (!user || !user.age || !user.weight || !user.height || !user.gender) {
    return 2000;
  }

  // 1. Hitung BMR (Mifflin-St Jeor Equation)
  let bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age);
  
  if (user.gender === 'male') {
    bmr += 5;
  } else if (user.gender === 'female') {
    bmr -= 161;
  } else {
    // Default fallback if gender is weird
    bmr -= 78; // average between male and female formula adjustments
  }

  // 2. Tentukan Activity Factor
  const occupation = user.occupation || 'other';
  // Map occupation to the known ones, otherwise fallback to 'other'
  let activityFactor = ACTIVITY_FACTORS[occupation] || ACTIVITY_FACTORS['other'];

  // 3. Hitung TDEE
  const tdee = bmr * activityFactor;

  return Math.round(tdee);
};

module.exports = {
  calculateDailyCalorieTarget,
};
