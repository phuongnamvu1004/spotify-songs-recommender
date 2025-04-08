import json

from fastapi import FastAPI, Request
from recommender.engine import recommender

app = FastAPI()

@app.post("/recommend")
async def recommend(request: Request):
    body = await request.json()
    access_token = body.get("accessToken")
    preferences = body.get("preferences")

    result = recommender(access_token, preferences)
    return json.loads(result)