/**
 * Sleep Analyzer Utility
 * Calculates sleep duration and classifies sleep quality based on PRD rules.
 */

/**
 * Menghitung durasi tidur dalam jam berdasarkan bed time dan wake time
 * @param {Date|string} bedTime - Waktu mulai tidur
 * @param {Date|string} wakeTime - Waktu bangun
 * @returns {number} Durasi tidur (jam)
 */
const calculateSleepDuration = (bedTime, wakeTime) => {
  const start = new Date(bedTime);
  const end = new Date(wakeTime);
  
  // Jika input tidak valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0;
  }

  let diffMs = end.getTime() - start.getTime();

  // Jika wakeTime < bedTime (misal tidur jam 23:00, bangun jam 06:00, 
  // dan date-nya diset sama secara tidak sengaja), tambahkan 1 hari
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000; // Tambah 24 jam dalam ms
  }

  const durationHours = diffMs / (1000 * 60 * 60);
  return Math.round(durationHours * 10) / 10; // 1 desimal
};

/**
 * Menentukan kualitas tidur (score dan teks analisis) berdasarkan durasi dan rating subjektif
 * @param {number} duration - Durasi tidur (jam)
 * @param {number} qualityRating - Rating subjektif user (1-5)
 * @returns {Object} { score: string, analysis: string }
 */
const getSleepQualityInfo = (duration, qualityRating) => {
  let score = 'Buruk';
  let analysis = 'Durasi tidurmu kurang dari yang direkomendasikan. Coba tidur lebih awal malam ini.';

  if (duration < 5) {
    score = 'Buruk';
    analysis = 'Durasi tidurmu kurang dari yang direkomendasikan. Coba tidur lebih awal malam ini.';
  } else if (duration >= 5 && duration < 7) {
    if (qualityRating <= 2) {
      score = 'Cukup';
      analysis = 'Pola tidurmu belum optimal. Usahakan tidur 7-9 jam per malam.';
    } else {
      score = 'Baik';
      analysis = 'Durasi tidurmu cukup memadai, namun usahakan bisa mencapai 7 jam.';
    }
  } else if (duration >= 7 && duration <= 9) {
    if (qualityRating <= 2) {
      score = 'Cukup';
      analysis = 'Meski durasinya cukup, kualitas tidurmu terasa kurang. Kurangi screen time sebelum tidur.';
    } else if (qualityRating === 3) {
      score = 'Baik';
      analysis = 'Durasi tidurmu sudah ideal. Pertahankan!';
    } else {
      score = 'Sangat Baik';
      analysis = 'Kualitas tidurmu sangat baik! Teruskan pola tidur sehat ini.';
    }
  } else if (duration > 9) {
    score = 'Cukup';
    analysis = 'Tidur berlebihan bisa membuat badan lemas. Usahakan tidur ideal 7-9 jam per malam.';
  }

  return { score, analysis };
};

const { mapOccupationToAI, mapGenderToAI } = require('./occupationMapper');

const getBmiCategory = (bmi) => {
  if (!bmi) return "Normal";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

/**
 * Membangun payload untuk endpoint AI /predict/sleep
 */
const buildSleepAIPayload = (user, duration, todaySteps) => {
  // Hitung BMI secara manual jika ada berat & tinggi badan
  let bmi = null;
  if (user.weight && user.height) {
    bmi = user.weight / Math.pow(user.height / 100, 2);
  }
  const bmiCategory = getBmiCategory(bmi);

  // Estimasi stress level berdasarkan occupation
  let stressLevel = 5; // Default moderat
  if (user.occupation) {
    const occ = user.occupation.toLowerCase();
    if (occ.includes('student') || occ.includes('education')) stressLevel = 6;
    if (occ.includes('medical') || occ.includes('healthcare')) stressLevel = 7;
    if (occ.includes('entrepreneur') || occ.includes('tech')) stressLevel = 6;
  }

  // Estimasi physical activity level
  const steps = todaySteps || 5000;
  let physicalActivityLevel = 30 + Math.floor(steps / 200); // Base 30, +1 per 200 steps
  if (physicalActivityLevel > 100) physicalActivityLevel = 100;

  return {
    Occupation: mapOccupationToAI(user.occupation),
    Sleep_Duration: duration,
    Stress_Level: stressLevel,
    Daily_Steps: steps,
    Heart_Rate: 72,       // Default normal
    Systolic_BP: 120,     // Default normal
    Diastolic_BP: 80,     // Default normal
    Gender: mapGenderToAI(user.gender),
    Age: user.age || 25,  // Default 25
    Physical_Activity_Level: physicalActivityLevel,
    BMI_Category: bmiCategory,
    Sleep_Disorder: "Healthy" // Default asumsi
  };
};

module.exports = {
  calculateSleepDuration,
  getSleepQualityInfo,
  buildSleepAIPayload,
};
