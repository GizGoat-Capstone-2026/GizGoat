const aiClient = require('../utils/aiClient');

/**
 * GET /api/foods/search?query=...
 * Proxy to AI Service for food search
 */
const searchFood = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    const aiData = await aiClient.searchFood(query);
    
    // Asumsi AI mengembalikan { count, foods: [...] }
    res.status(200).json({
      success: true,
      data: aiData.foods || [],
      count: aiData.count || 0
    });
  } catch (error) {
    console.error('Error searching food via AI (fallback to empty):', error.message);
    res.status(200).json({
      success: true,
      data: [],
      count: 0,
      fallback: true
    });
  }
};

/**
 * POST /api/foods/nutrition
 * Body: { foodName: "Nasi Goreng" }
 * Proxy to AI Service for specific nutrition details
 */
const getFoodNutrition = async (req, res, next) => {
  try {
    const { foodName } = req.body;
    if (!foodName) {
      return res.status(400).json({ success: false, message: 'foodName is required' });
    }

    const aiData = await aiClient.getFoodNutrition(foodName);
    
    // AI return { food: "Nasi Goreng", calories, carbs, protein, fat }
    res.status(200).json({
      success: true,
      data: aiData
    });
  } catch (error) {
    console.error('Error getting food nutrition via AI:', error);
    next(error);
  }
};

module.exports = {
  searchFood,
  getFoodNutrition,
};
