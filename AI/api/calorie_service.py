def estimate_calories(
    gender: str,
    age: int,
    weight: float,
    height: float,
    activity_level: str
):

    gender = gender.lower()
    activity_level = activity_level.lower()

    if gender not in [
        "male",
        "female"
    ]:

        raise ValueError(
            "Gender must be male or female"
        )

    if gender == "male":

        bmr = (
            (10 * weight)
            +
            (6.25 * height)
            -
            (5 * age)
            +
            5
        )

    else:

        bmr = (
            (10 * weight)
            +
            (6.25 * height)
            -
            (5 * age)
            -
            161
        )

    multipliers = {

        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9

    }

    multiplier = multipliers.get(
        activity_level
    )

    if multiplier is None:

        raise ValueError(
            "Invalid activity level"
        )

    daily_calories = (
        bmr
        *
        multiplier
    )

    return {

        "bmr":
        round(
            bmr,
            2
        ),

        "daily_calories":
        round(
            daily_calories,
            2
        )

    }