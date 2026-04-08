from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from .authentication import get_current_user
from .. import schemas, models, database
from google import genai
from google.genai import types
from dotenv import load_dotenv
from pathlib import Path
import json
import os

router = APIRouter(
    tags=['AI-Functions']
)

# --- CONFIGURATION ---
# Configure Google AI Studio Key
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("Missing GOOGLE_API_KEY environment variable")

client = genai.Client(api_key=GOOGLE_API_KEY)


@router.post("/analyze-food")
async def analyze_food(file: UploadFile = File(...), current_user: models.User = Depends(get_current_user)):
    try:
        # Read the raw bytes from the upload
        image_bytes = await file.read()
        
        # Construct the prompt with strict JSON requirements
        # Note: 'protien' spelling maintained as requested
        prompt = """
        Analyze this food image and return ONLY a JSON object. 
        Format:
        {
          "items": "string description",
          "carbohydrate": <int calories>,
          "protein": <int calories>,
          "fat": <int calories>
        }
        Use the exact key 'protien'. Provide values in calories as integers.
        If food cannot be identified or an error occurs, return:
        {"error": "errordetail"}
        No other text or markdown.
        """

        # Call the latest Gemini 3 Flash Preview model
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=str(file.content_type)),
                prompt
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        output = response.text
        if not output:
            output = '"error": "Nothing returned!"'

        # Parse the JSON string from Gemini's response
        result = json.loads(output)
        return result

    except Exception as e:
        # Catch-all for API or connection errors
        return JSONResponse(
            status_code=500,
            content={"error": f"Server Error: {str(e)}"}
        )