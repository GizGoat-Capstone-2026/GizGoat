from pathlib import Path
import pandas as pd

ROOT_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = (
    ROOT_DIR
    / "data"
    / "dataset_nutrisi.csv"
)

if not DATA_PATH.exists():

    raise FileNotFoundError(
        f"Nutrition dataset not found: {DATA_PATH}"
    )

nutrition_df = pd.read_csv(DATA_PATH)


def search_food(
    query: str
):

    results = nutrition_df[
        nutrition_df["nama"]
        .str.contains(
            query,
            case=False,
            na=False
        )
    ]

    return (
        results
        .head(10)
        .to_dict(
            orient="records"
        )
    )


def get_food_nutrition(
    food_name: str
):

    result = nutrition_df[
        nutrition_df["nama"]
        .str.lower()
        ==
        food_name.lower()
    ]

    if result.empty:
        return None

    return (
        result.iloc[0]
        .to_dict()
    )


def calculate_food_totals(
    food_list: list[str]
):

    total_calories = 0
    total_fat = 0
    total_carbohydrates = 0
    total_protein = 0

    found_foods = []

    for food in food_list:

        item = nutrition_df[
            nutrition_df["nama"]
            .str.lower()
            ==
            food.lower()
        ]

        if item.empty:
            continue

        row = item.iloc[0]

        total_calories += float(
            row["kalori"]
        )

        total_fat += float(
            row["lemak"]
        )

        total_carbohydrates += float(
            row["karbohidrat"]
        )

        total_protein += float(
            row["protein"]
        )

        found_foods.append(
            row["nama"]
        )

    return {

        "foods":
        found_foods,

        "total_calories":
        round(
            total_calories,
            2
        ),

        "total_fat":
        round(
            total_fat,
            2
        ),

        "total_carbohydrates":
        round(
            total_carbohydrates,
            2
        ),

        "total_protein":
        round(
            total_protein,
            2
        )
    }