from fastapi import APIRouter, Depends
from .. import schemas, models, database
from .authentication import get_current_user
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime, timezone, time
from typing import Any

router = APIRouter(
    tags=['analytics']
)

@router.post("/meals/")
def enter_meal_entry(
    meal_entry: schemas.MealEntry,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    db_meal = models.MealEntry(
        user_id = current_user.id,
        protien = meal_entry.protien,
        carbohydrate = meal_entry.carbohydrate,
        fat = meal_entry.fat,
        calories = meal_entry.protien + meal_entry.carbohydrate + meal_entry.fat,
        created_at = datetime.now(timezone.utc)
    )

    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)

    return {"message": "Meal Logged Successfully"}


@router.get("/daily-analytics/")
def show_daily_analytics(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    today_start = datetime.combine(datetime.now(timezone.utc).date(), time.min)
    today_end = datetime.combine(datetime.now(timezone.utc).date(), time.max)

    totals: Any = db.query(
        func.coalesce(func.sum(models.MealEntry.calories), 0.0).label("calories"),
        func.coalesce(func.sum(models.MealEntry.carbohydrate), 0.0).label("carbohydrate"),
        func.coalesce(func.sum(models.MealEntry.protien), 0.0).label("protien"),
        func.coalesce(func.sum(models.MealEntry.fat), 0.0).label("fat"),
    ).filter(
        models.MealEntry.user_id == current_user.id,
        models.MealEntry.created_at >= today_start,
        models.MealEntry.created_at <= today_end
    ).first()

    return{
        "date": today_start.date(),
        "analytics": {
            "calories": totals.calories,
            "protien": totals.protien,
            "carbohydrate": totals.carbohydrate,
            "fat": totals.fat
        }
    }
    