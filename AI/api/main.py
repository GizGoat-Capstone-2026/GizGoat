from fastapi import (
    FastAPI,
    HTTPException
)

from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

import tensorflow as tf
import pandas as pd
import joblib
import json

from pathlib import Path

from .custom_layers import (
    FeatureNoiseLayer,
    DenseWithQuantization
)

from .schemas import (
    SleepRequest,
    SleepResponse,

    BMIRequest,
    BMIResponse,

    CalorieRequest,
    CalorieResponse,

    FoodRequest,
    FoodTrackerRequest,
    FoodResponse,
    FoodSearchResponse,
    FoodNutritionResponse,
    FoodTrackerResponse,

    RecommendationRequest,
    RecommendationResponse,

    ModelInfoResponse
)

from .nutrition_service import (
    search_food,
    get_food_nutrition,
    calculate_food_totals
)

from .bmi_service import (
    calculate_bmi,
    bmi_category
)

from .calorie_service import (
    estimate_calories
)

from .recommendation_service import (
    generate_lifestyle_recommendation
)


# =====================================
# PATHS

ROOT_DIR = Path(__file__).resolve().parent.parent

ARTIFACTS_DIR = ROOT_DIR / "artifacts"
MODELS_DIR = ROOT_DIR / "models"
METADATA_DIR = ROOT_DIR / "metadata"


# =====================================
# APP

app = FastAPI(
    title="GizGoat AI Service",
    description="""
    AI Service untuk:

    - Sleep Analysis
    - BMI Calculator
    - Calorie Estimation
    - Food Nutrition Search
    - Food Nutrition Tracking
    - Recommendation Engine
    """,
    version="2.0.0"
)

# =====================================
# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================
# LOAD ARTIFACTS

feature_scaler = joblib.load(ARTIFACTS_DIR / "feature_scaler.pkl")
target_scaler = joblib.load(ARTIFACTS_DIR / "target_scaler.pkl")
occupation_encoder = joblib.load(ARTIFACTS_DIR / "occupation_encoder.pkl")
feature_columns = joblib.load(ARTIFACTS_DIR / "feature_columns.pkl")
gender_encoder = joblib.load(ARTIFACTS_DIR / "gender_encoder.pkl")
bmi_encoder = joblib.load(ARTIFACTS_DIR / "bmi_encoder.pkl")
sleep_encoder = joblib.load(ARTIFACTS_DIR / "sleepdisorder_encoder.pkl")

api_model = tf.keras.models.load_model(
    MODELS_DIR / "gizgoat_sleep_quality_model.keras",
    custom_objects={
        "FeatureNoiseLayer": FeatureNoiseLayer,
        "Dense": DenseWithQuantization
    }
)

with open(METADATA_DIR / "model_metadata.json", "r") as file:
    model_metadata = json.load(file)


# =====================================
# HELPERS

def get_sleep_category(score: float):
    if score >= 8:
        return "Excellent"
    if score >= 6:
        return "Moderate"
    return "Poor"


def generate_sleep_recommendation(score: float):
    if score >= 8:
        return "Sleep quality is excellent. Maintain your current sleep routine."
    elif score >= 6:
        return "Sleep quality is moderate. Consider improving sleep consistency and reducing stress."
    return "Sleep quality is low. Increase sleep duration and improve sleep habits."


# =====================================
# ROOT

@app.get("/")
def home():
    return {
        "service": "GizGoat AI Service",
        "version": "2.0.0",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": True
    }


@app.get("/model-info", response_model=ModelInfoResponse)
def model_info():
    return model_metadata


@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)


# =====================================
# SLEEP ANALYSIS

@app.post("/predict/sleep", response_model=SleepResponse)
def predict_sleep(request: SleepRequest):
    try:
        try:
            occupation_encoded = occupation_encoder.transform(
                [request.Occupation]
            )[0]
        except Exception:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown occupation: {request.Occupation}"
            )

        # use persisted encoders for categorical fields
        try:
            gender_val = int(gender_encoder.transform([str(request.Gender)])[0])
        except Exception:
            raise HTTPException(status_code=400, detail=f"Unknown gender: {request.Gender}")

        try:
            bmi_val = int(bmi_encoder.transform([str(request.BMI_Category)])[0])
        except Exception:
            raise HTTPException(status_code=400, detail=f"Unknown BMI category: {request.BMI_Category}")

        try:
            sd_val = int(sleep_encoder.transform([str(request.Sleep_Disorder)])[0])
        except Exception:
            raise HTTPException(status_code=400, detail=f"Unknown sleep disorder: {request.Sleep_Disorder}")

        # Physical activity is numeric in dataset
        try:
            pal_val = int(request.Physical_Activity_Level)
        except Exception:
            pal_val = 0

        sample = pd.DataFrame([{
            "Occupation": occupation_encoded,
            "Sleep Duration": request.Sleep_Duration,
            "Stress Level": request.Stress_Level,
            "Daily Steps": request.Daily_Steps,
            "Heart Rate": request.Heart_Rate,
            "Systolic BP": request.Systolic_BP,
            "Diastolic BP": request.Diastolic_BP,
            "Gender": gender_val,
            "Age": request.Age,
            "Physical Activity Level": pal_val,
            "BMI Category": bmi_val,
            "Sleep Disorder": sd_val
        }])

        sample["Sleep_Efficiency"] = sample["Sleep Duration"] / (sample["Stress Level"] + 1)
        sample["Activity_Ratio"] = sample["Daily Steps"] / (sample["Heart Rate"] + 1)
        sample["Pulse Pressure"] = sample["Systolic BP"] - sample["Diastolic BP"]
        sample["Stress_Sleep_Ratio"] = sample["Stress Level"] / (sample["Sleep Duration"] + 1e-5)
        sample["BP_Ratio"] = sample["Systolic BP"] / (sample["Diastolic BP"] + 1)
        sample["Stress_Heart"] = sample["Stress Level"] * sample["Heart Rate"]

        sample = sample[feature_columns]
        sample_scaled = feature_scaler.transform(sample)

        try:
            prediction = api_model.predict(sample_scaled, verbose=0)
            prediction_original = target_scaler.inverse_transform(prediction)
            sleep_score = float(prediction_original[0][0])

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Inference error: {str(e)}"
            )

        return SleepResponse(
            sleep_score=round(sleep_score, 2),
            sleep_category=get_sleep_category(sleep_score),
            recommendation=generate_sleep_recommendation(sleep_score)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================
# BMI

@app.post("/predict/bmi", response_model=BMIResponse)
def predict_bmi(request: BMIRequest):
    bmi = calculate_bmi(request.weight, request.height)

    return BMIResponse(
        bmi=bmi,
        category=bmi_category(bmi)
    )


# =====================================
# CALORIES

@app.post("/predict/calories", response_model=CalorieResponse)
def predict_calories(request: CalorieRequest):
    result = estimate_calories(
        age=request.age,
        gender=request.gender,
        weight=request.weight,
        height=request.height,
        activity_level=request.activity_level
    )

    return CalorieResponse(
        bmr=result["bmr"],
        daily_calories=result["daily_calories"]
    )


# =====================================
# RECOMMENDATION

@app.post("/recommendation", response_model=RecommendationResponse)
def recommendation(request: RecommendationRequest):
    recommendations = generate_lifestyle_recommendation(
        bmi=request.bmi,
        sleep_score=request.sleep_score,
        consumed_calories=request.consumed_calories,
        recommended_calories=request.recommended_calories
    )

    return RecommendationResponse(recommendations=recommendations)


# =====================================
# FOOD SEARCH

@app.get("/foods/search", response_model=FoodSearchResponse)
def foods_search(query: str):
    foods = search_food(query)

    return {
        "count": len(foods),
        "foods": foods
    }


# =====================================
# FOOD NUTRITION DETAIL

@app.post("/foods/nutrition", response_model=FoodNutritionResponse)
def food_nutrition(request: FoodRequest):
    food = get_food_nutrition(request.food_name)

    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")

    return {"food": food}


# =====================================
# FOOD TRACKER

@app.post("/foods/tracker", response_model=FoodTrackerResponse)
def food_tracker(request: FoodTrackerRequest):
    return calculate_food_totals(request.foods)


# =====================================
# OCCUPATIONS

@app.get("/occupations")
def get_occupations():
    return {
        "occupations": [
            "Education",
            "Law",
            "Medical",
            "Office Worker",
            "Sales",
            "Tech"
        ]
    }