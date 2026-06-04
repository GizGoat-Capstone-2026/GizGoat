/**
 * Activity Calculator Utility
 * Calculates derived metrics from step counts and activity durations.
 */

/**
 * Menghitung estimasi kalori yang terbakar dari jumlah langkah
 * @param {number} steps - Jumlah langkah
 * @returns {number} Kalori terbakar (kkal)
 */
const calculateCaloriesBurnedFromSteps = (steps) => {
  if (!steps || steps < 0) return 0;
  // Kalori Terbakar ≈ langkah × 0.04 kkal
  return Math.round(steps * 0.04 * 100) / 100;
};

/**
 * Menghitung estimasi jarak tempuh dari jumlah langkah
 * @param {number} steps - Jumlah langkah
 * @returns {number} Jarak tempuh (km)
 */
const calculateDistanceFromSteps = (steps) => {
  if (!steps || steps < 0) return 0;
  // Jarak ≈ langkah × 0.00075 km (rata-rata stride length)
  return Math.round(steps * 0.00075 * 100) / 100;
};

/**
 * Menghitung persentase progress langkah harian
 * @param {number} currentSteps - Langkah saat ini
 * @param {number} targetSteps - Target langkah harian
 * @returns {number} Persentase progress (0-100)
 */
const calculateProgressPercentage = (currentSteps, targetSteps) => {
  if (!targetSteps || targetSteps <= 0) return 0;
  if (!currentSteps || currentSteps <= 0) return 0;
  const progress = (currentSteps / targetSteps) * 100;
  return Math.min(Math.round(progress), 100); // Max 100%
};

/**
 * Mengecek apakah target langkah sudah tercapai
 * @param {number} currentSteps - Langkah saat ini
 * @param {number} targetSteps - Target langkah harian
 * @returns {boolean} True jika target tercapai
 */
const isTargetAchieved = (currentSteps, targetSteps) => {
  if (!targetSteps || targetSteps <= 0) return false;
  if (!currentSteps || currentSteps <= 0) return false;
  return currentSteps >= targetSteps;
};

module.exports = {
  calculateCaloriesBurnedFromSteps,
  calculateDistanceFromSteps,
  calculateProgressPercentage,
  isTargetAchieved,
};
