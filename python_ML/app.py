import json

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from recommender.engine import recommender

import os
from dotenv import load_dotenv

load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("BACKEND_URL")],  # Or limit to ["https://your-node-backend.onrender.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/recommend")
async def recommend(request: Request):
    body = await request.json()
    access_token = body.get("accessToken")
    preferences = body.get("preferences")

    result = recommender(access_token, preferences)
    return json.loads(result)