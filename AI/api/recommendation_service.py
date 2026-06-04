def generate_lifestyle_recommendation(
    bmi: float,
    sleep_score: float,
    consumed_calories: float,
    recommended_calories: float
):

    recommendations = []

    # BMI

    if bmi < 18.5:

        recommendations.append(
            "Increase healthy calorie intake and maintain balanced nutrition."
        )

    elif bmi >= 25:

        recommendations.append(
            "Increase physical activity and manage daily calorie intake."
        )

    # Sleep

    if sleep_score < 6:

        recommendations.append(
            "Improve sleep duration and maintain a consistent sleep schedule."
        )

    # Calories

    if consumed_calories > recommended_calories:

        recommendations.append(
            "Daily calorie intake exceeds recommended levels."
        )

    elif consumed_calories < (recommended_calories * 0.8):

        recommendations.append(
            "Daily calorie intake is below recommended levels."
        )

    if not recommendations:

        recommendations.append(
            "Maintain your current healthy lifestyle."
        )

    return recommendations