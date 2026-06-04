def calculate_bmi(
    weight: float,
    height: float
) -> float:

    bmi = weight / ((height / 100) ** 2)

    return round(
        bmi,
        2
    )


def bmi_category(
    bmi: float
) -> str:

    if bmi < 18.5:
        return "Underweight"

    elif bmi < 25:
        return "Normal"

    elif bmi < 30:
        return "Overweight"

    return "Obese"