from pydantic import BaseModel
from typing import List


# =====================================
# SLEEP ANALYSIS

class SleepRequest(BaseModel):
    Occupation: str
    Sleep_Duration: float
    Stress_Level: int
    Daily_Steps: int
    Heart_Rate: int
    Systolic_BP: int
    Diastolic_BP: int
    Gender: str
    Age: int
    Physical_Activity_Level: int
    BMI_Category: str
    Sleep_Disorder: str


class SleepResponse(BaseModel):
    sleep_score: float
    sleep_category: str
    recommendation: str


# =====================================
# BMI

class BMIRequest(BaseModel):
    weight: float
    height: float


class BMIResponse(BaseModel):
    bmi: float
    category: str


# =====================================
# CALORIE

class CalorieRequest(BaseModel):
    gender: str
    age: int
    weight: float
    height: float
    activity_level: str


class CalorieResponse(BaseModel):
    bmr: float
    daily_calories: float


# =====================================
# RECOMMENDATION

class RecommendationRequest(BaseModel):
    bmi: float
    sleep_score: float
    consumed_calories: float
    recommended_calories: float


class RecommendationResponse(BaseModel):
    recommendations: List[str]


# =====================================
# FOOD SEARCH

class FoodRequest(BaseModel):
    food_name: str


class FoodTrackerRequest(BaseModel):
    foods: List[str]


class FoodResponse(BaseModel):
    nama: str
    kalori: float
    lemak: float
    karbohidrat: float
    protein: float


class FoodSearchResponse(BaseModel):
    count: int
    foods: List[FoodResponse]


class FoodNutritionResponse(BaseModel):
    food: FoodResponse


class FoodTrackerResponse(BaseModel):
    foods: List[str]
    total_calories: float
    total_fat: float
    total_carbohydrates: float
    total_protein: float


# =====================================
# MODEL INFO

class ModelInfoResponse(BaseModel):
    model_name: str
    version: str
    framework: str
    mae: float
    r2: float
    accuracy: float