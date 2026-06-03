from fastapi import FastAPI
from fastapi.responses import Response
import tensorflow as tf
import pandas as pd
import joblib
from pathlib import Path

from .custom_layers import FeatureNoiseLayer, DenseWithQuantization

ROOT_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = ROOT_DIR / "artifacts"
MODELS_DIR = ROOT_DIR / "models"

app = FastAPI(
    title="GizGoat Sleep Quality API",
    version="1.0.0"
)

# Load Artifacts

feature_scaler = joblib.load(
    ARTIFACTS_DIR / "feature_scaler.pkl"
)

target_scaler = joblib.load(
    ARTIFACTS_DIR / "target_scaler.pkl"
)

occupation_encoder = joblib.load(
    ARTIFACTS_DIR / "occupation_encoder.pkl"
)

feature_columns = joblib.load(
    ARTIFACTS_DIR / "feature_columns.pkl"
)

api_model = tf.keras.models.load_model(
    MODELS_DIR / "gizgoat_sleep_quality_model.keras",
    custom_objects={
        "FeatureNoiseLayer": FeatureNoiseLayer,
        "Dense": DenseWithQuantization
    }
)

# Recommendation Engine

def generate_sleep_recommendation(
    sleep_score
):

    if sleep_score >= 8:

        return (
            "Sleep quality is excellent."
        )

    elif sleep_score >= 6:

        return (
            "Sleep quality is moderate."
        )

    else:

        return (
            "Sleep quality is low."
        )

# Routes

@app.get("/")
def home():

    return {

        "service":
        "GizGoat Sleep Quality API",

        "version":
        "1.0.0",

        "status":
        "running"
    }


@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)


@app.post("/predict")
def predict(data: dict):

    sample = pd.DataFrame([data])

    sample["Occupation"] = (
        occupation_encoder.transform(
            [sample["Occupation"][0]]
        )
    )

    sample["Sleep_Efficiency"] = (
        sample["Sleep Duration"]
        /
        (sample["Stress Level"] + 1)
    )

    sample["Activity_Ratio"] = (
        sample["Daily Steps"]
        /
        (sample["Heart Rate"] + 1)
    )

    sample["Pulse Pressure"] = (
        sample["Systolic BP"]
        -
        sample["Diastolic BP"]
    )

    sample["Stress_Sleep_Ratio"] = (
        sample["Stress Level"]
        /
        (sample["Sleep Duration"] + 1e-5)
    )

    sample["BP_Ratio"] = (
        sample["Systolic BP"]
        /
        (sample["Diastolic BP"] + 1)
    )

    sample["Stress_Heart"] = (
        sample["Stress Level"]
        *
        sample["Heart Rate"]
    )

    sample = sample[
        feature_columns
    ]

    sample_scaled = (
        feature_scaler.transform(
            sample
        )
    )

    prediction = api_model.predict(
        sample_scaled,
        verbose=0
    )

    prediction_original = (
        target_scaler.inverse_transform(
            prediction
        )
    )

    sleep_score = float(
        prediction_original[0][0]
    )

    return {

        "prediction":
        round(
            sleep_score,
            2
        ),

        "recommendation":
        generate_sleep_recommendation(
            sleep_score
        )
    }