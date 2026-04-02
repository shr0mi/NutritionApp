from fastapi import FastAPI
from .routers import user
from . import models, database

# Create tables on startup
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Hackathon-Template-Backend")

app.include_router(user.router)