from fastapi import FastAPI
from .routers import user, authentication, ai_funcs, analytics
from . import models, database
from fastapi.middleware.cors import CORSMiddleware

# Create tables on startup
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Pusti-Tusti-Backend")

# Handle CORS issues
origins = [
    "http://localhost:5173",      # Your Vite dev server
    "http://127.0.0.1:5173",      # Sometimes needed
    "http://localhost",           # Extra safety
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # You can use ["*"] for quick testing (not recommended for production)
    allow_credentials=True,       # Important if you use cookies or auth later
    allow_methods=["*"],          # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],          # Allow all headers (like Content-Type)
)

# Routers
app.include_router(authentication.router)
app.include_router(user.router)
app.include_router(ai_funcs.router)
app.include_router(analytics.router)