from pydantic import BaseModel, EmailStr, Field


# User
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True  # SQLAlchemy 2.0 style



# Authentication
class Login(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int

class TokenData(BaseModel):
    username: str | None = None


# ai_funcs.py
# This model ensures Gemini sent back the correct data types
class FoodAnalysisResponse(BaseModel):
    items: str = Field(description="A brief description of food items identified")
    carbohydrate: int = Field(description="Calories derived from carbohydrates")
    protien: int = Field(description="Calories derived from protein (note sp mistake required)")
    fat: int = Field(description="Calories derived from fat")

# This model ensures standard error responses
class ErrorResponse(BaseModel):
    error: str


# Anlytics.py

class MealEntry(BaseModel):
    protien: float
    carbohydrate: float
    fat: float