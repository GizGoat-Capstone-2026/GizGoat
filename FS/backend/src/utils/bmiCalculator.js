/**
 * BMI Calculator Utility
 * Business logic for calculating BMI, determining category, and providing tips.
 */

/**
 * Menghitung nilai BMI dari tinggi (cm) dan berat (kg)
 * @param {number} height - Tinggi badan dalam cm
 * @param {number} weight - Berat badan dalam kg
 * @returns {number} Nilai BMI (2 desimal)
 */
const calculateBmi = (height, weight) => {
  if (!height || !weight || height <= 0 || weight <= 0) return 0;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 100) / 100;
};

/**
 * Menentukan kategori BMI dan memberikan tips kesehatan
 * @param {number} bmi - Nilai BMI
 * @returns {Object} { category, tips }
 */
const getBmiDetails = (bmi) => {
  if (bmi <= 0) {
    return { category: 'Unknown', tips: ['Data tidak valid.'] };
  }

  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      tips: [
        'Kamu perlu menambah asupan kalori dan nutrisi.', 
        'Konsumsi makanan bergizi tinggi secara teratur.',
        'Pertimbangkan latihan kekuatan otot.'
      ],
    };
  }

  if (bmi < 25) {
    return {
      category: 'Normal',
      tips: [
        'BMI kamu ideal!',
        'Pertahankan pola makan seimbang dan aktivitas fisik teratur.',
        'Terus pantau kesehatan Anda secara rutin.'
      ],
    };
  }

  if (bmi < 30) {
    return {
      category: 'Overweight',
      tips: [
        'Kurangi makanan berlemak dan tinggi gula.', 
        'Tingkatkan aktivitas fisik harian Anda.',
        'Target 30 menit olahraga per hari.'
      ],
    };
  }

  return {
    category: 'Obese',
    tips: [
      'Penting untuk menurunkan berat badan demi kesehatan.',
      'Konsultasikan dengan ahli gizi untuk program penurunan berat badan yang aman.',
      'Mulai dengan olahraga ringan seperti berjalan kaki.'
    ],
  };
};

module.exports = {
  calculateBmi,
  getBmiDetails,
};
