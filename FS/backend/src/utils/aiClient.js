const axios = require('axios');
const config = require('../config');

// Buat instance axios untuk AI Service
const aiAxios = axios.create({
  baseURL: config.aiServiceUrl,
  timeout: 10000, // 10 detik timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Helper untuk menghandle error dari AI Service
 */
const handleAiError = (error, context) => {
  console.error(`[AI Client Error - ${context}]:`, error.message);
  
  const customError = new Error(`Gagal menghubungi AI Service untuk ${context}`);
  customError.isAIUnavailable = true;
  customError.originalError = error;
  
  if (error.response) {
    console.error('Response data:', error.response.data);
    customError.status = error.response.status;
    customError.aiResponse = error.response.data;
  }
  
  throw customError;
};

const aiClient = {
  /**
   * Health Check
   */
  async checkHealth() {
    try {
      const response = await aiAxios.get('/health');
      return response.data;
    } catch (error) {
      return handleAiError(error, 'checkHealth');
    }
  },

  /**
   * Sleep Analysis
   */
  async predictSleep(payload) {
    try {
      const response = await aiAxios.post('/predict/sleep', payload);
      return response.data;
    } catch (error) {
      return handleAiError(error, 'predictSleep');
    }
  },

  /**
   * BMI Calculator
   */
  async predictBmi(payload) {
    try {
      const response = await aiAxios.post('/predict/bmi', payload);
      return response.data;
    } catch (error) {
      return handleAiError(error, 'predictBmi');
    }
  },

  /**
   * Calorie Estimation
   */
  async predictCalories(payload) {
    try {
      const response = await aiAxios.post('/predict/calories', payload);
      return response.data;
    } catch (error) {
      return handleAiError(error, 'predictCalories');
    }
  },

  /**
   * Recommendation Engine
   */
  async getRecommendation(payload) {
    try {
      const response = await aiAxios.post('/recommendation', payload);
      return response.data;
    } catch (error) {
      return handleAiError(error, 'getRecommendation');
    }
  },

  /**
   * Food Search
   */
  async searchFood(query) {
    try {
      const response = await aiAxios.get(`/foods/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      return handleAiError(error, 'searchFood');
    }
  },

  /**
   * Food Nutrition Detail
   */
  async getFoodNutrition(foodName) {
    try {
      const response = await aiAxios.post('/foods/nutrition', { food_name: foodName });
      return response.data;
    } catch (error) {
      return handleAiError(error, 'getFoodNutrition');
    }
  },

  /**
   * Food Nutrition Tracking
   */
  async trackFoods(foods) {
    try {
      const response = await aiAxios.post('/foods/tracker', { foods });
      return response.data;
    } catch (error) {
      return handleAiError(error, 'trackFoods');
    }
  }
};

module.exports = aiClient;
