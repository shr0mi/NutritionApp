from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from .database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class MealEntry(Base):
    __tablename__ = "meal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)

    calories = Column(Float, nullable=False)
    protien = Column(Float, default=0.0)
    carbohydrate = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)

    created_at = Column(DateTime, default=datetime.now(timezone.utc))