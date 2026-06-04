/**
 * Rule-Based Recommendation Engine
 * Calculates a health score and generates personalized text recommendations
 * based on user profile and recent 7-day averages.
 */

const getDietRecommendation = (occupation, ratio) => {
  let rec = { title: 'Nutrisi Harian', description: '', priority: 'Siang' };

  if (ratio < 0.6) {
    rec.title = 'Asupan Kalori Kurang';
    rec.description = 'Kamu makan jauh di bawah target. Tingkatkan asupan kalori agar tubuh tidak lemas.';
    rec.priority = 'Pagi';
  } else if (ratio > 1.1) {
    rec.title = 'Surplus Kalori';
    rec.description = 'Asupan kalori kamu sedikit berlebih. Kurangi camilan manis atau gorengan.';
    rec.priority = 'Malam';
  } else {
    // Normal ratio, fallback to occupation
    switch (occupation) {
      case 'office_worker':
        rec.title = 'Makan Siang Sehat';
        rec.description = 'Diet: Makan siang seimbang, hindari junk food agar tidak ngantuk di kantor.';
        break;
      case 'field_worker':
        rec.title = 'Protein Recovery';
        rec.description = 'Diet: Tingkatkan protein untuk recovery otot setelah bekerja fisik.';
        break;
      case 'student':
        rec.title = 'Fokus Belajar';
        rec.description = 'Diet: Sarapan teratur, hindari begadang dengan kopi berlebih.';
        break;
      case 'entrepreneur':
        rec.title = 'Konsistensi Nutrisi';
        rec.description = 'Diet: Coba meal prep untuk menjaga konsistensi nutrisi meski sibuk.';
        break;
      case 'healthcare':
        rec.title = 'Energi Ekstra';
        rec.description = 'Diet: Makan padat nutrisi, sering tapi sedikit di sela-sela shift.';
        break;
      default:
        rec.title = 'Pola Makan Seimbang';
        rec.description = 'Diet: Jaga pola makan seimbang dengan porsi sayur yang cukup.';
    }
  }

  return rec;
};

const getSleepRecommendation = (occupation, duration, qualityScore) => {
  let rec = { title: 'Pemulihan Tidur', description: '', priority: 'Malam' };

  if (duration < 6 || qualityScore === 'Buruk') {
    rec.title = 'Kurang Tidur';
    rec.description = 'Tidur kamu kurang atau buruk. Usahakan tidur lebih awal malam ini untuk pemulihan.';
  } else if (duration > 9) {
    rec.title = 'Over-sleeping';
    rec.description = 'Terlalu lama tidur bisa membuatmu lesu. Cobalah pasang alarm untuk 8 jam tidur.';
  } else {
    // Normal sleep, fallback to occupation
    switch (occupation) {
      case 'office_worker':
        rec.description = 'Tidur: Hindari menatap layar gadget minimal 1 jam sebelum tidur.';
        break;
      case 'field_worker':
        rec.description = 'Tidur: Pastikan tidur minimal 8 jam untuk meredakan pegal fisik.';
        break;
      case 'student':
        rec.description = 'Tidur: Usahakan pola tidur reguler, jangan terlalu banyak begadang tugas.';
        break;
      case 'entrepreneur':
        rec.description = 'Tidur: Lakukan manajemen stres (seperti meditasi ringan) sebelum tidur.';
        break;
      case 'healthcare':
        rec.description = 'Tidur: Prioritaskan recovery. Jika shift malam, sempatkan power nap.';
        break;
      default:
        rec.description = 'Tidur: Pertahankan 7-9 jam per malam untuk kesehatan optimal.';
    }
  }

  return rec;
};

const getActivityRecommendation = (occupation, ratio) => {
  let rec = { title: 'Aktivitas Fisik', description: '', priority: 'Sore' };

  if (ratio < 0.5) {
    rec.title = 'Kurang Gerak';
    rec.description = 'Aktivitasmu sangat minim minggu ini. Sempatkan jalan kaki 15-30 menit hari ini.';
    rec.priority = 'Pagi';
  } else if (ratio >= 1.0) {
    rec.title = 'Target Tercapai!';
    rec.description = 'Luar biasa, aktivitas fisikmu melampaui target. Jangan lupa istirahat yang cukup.';
  } else {
    // Normal activity, fallback to occupation
    switch (occupation) {
      case 'office_worker':
        rec.description = 'Aktivitas: Stretching ringan tiap 2 jam, atau jalan kaki saat istirahat makan siang.';
        break;
      case 'field_worker':
        rec.description = 'Aktivitas: Kamu sudah banyak bergerak, fokus pada stretching & recovery otot sore ini.';
        break;
      case 'student':
        rec.description = 'Aktivitas: Sempatkan 30 menit olahraga ringan per hari di sela jadwal kelas.';
        break;
      case 'entrepreneur':
        rec.description = 'Aktivitas: Jalan kaki 20 menit saat break kerja bisa menjernihkan pikiran.';
        break;
      case 'healthcare':
        rec.description = 'Aktivitas: Lakukan low-impact exercise seperti yoga untuk melepas penat.';
        break;
      default:
        rec.description = 'Aktivitas: Usahakan mencapai 8000 langkah per hari.';
    }
  }

  return rec;
};

/**
 * Generate personal health recommendations
 */
const generateRecommendations = (data) => {
  const {
    bmiCategory,
    avgCalories,
    calorieTarget,
    avgSleepDuration,
    avgSleepQualityScore,
    avgSteps,
    stepsTarget,
    occupation,
  } = data;

  let score = 50; // Base score

  // 1. BMI Factor (max +20)
  if (bmiCategory === 'Normal') score += 20;
  else if (bmiCategory === 'Underweight' || bmiCategory === 'Overweight') score += 5;
  
  // 2. Calorie Factor (max +15)
  const calRatio = calorieTarget > 0 ? (avgCalories / calorieTarget) : 0;
  if (calRatio >= 0.8 && calRatio <= 1.1) score += 15;
  else if (calRatio >= 0.6 && calRatio < 0.8) score += 8;
  else if (calRatio > 1.1) score += 5;
  
  // 3. Sleep Factor (max +15)
  if (avgSleepDuration >= 7 && avgSleepDuration <= 9 && (avgSleepQualityScore === 'Baik' || avgSleepQualityScore === 'Sangat Baik')) {
    score += 15;
  } else if ((avgSleepDuration >= 6 && avgSleepDuration < 7) || avgSleepQualityScore === 'Cukup') {
    score += 8;
  }

  // 4. Activity Factor (max +10)
  const stepsRatio = stepsTarget > 0 ? (avgSteps / stepsTarget) : 0;
  if (stepsRatio >= 1.0) score += 10;
  else if (stepsRatio >= 0.8) score += 7;
  else if (stepsRatio >= 0.5) score += 4;

  score = Math.min(Math.round(score), 100);

  // Zone classification
  let zone = 'Berisiko';
  if (score >= 80) zone = 'Optimal';
  else if (score >= 50) zone = 'Stabil';

  const recommendations = {
    diet: getDietRecommendation(occupation, calRatio),
    sleep: getSleepRecommendation(occupation, avgSleepDuration, avgSleepQualityScore),
    activity: getActivityRecommendation(occupation, stepsRatio),
  };

  return {
    healthScore: score,
    zone,
    recommendations,
  };
};

module.exports = {
  generateRecommendations,
};
