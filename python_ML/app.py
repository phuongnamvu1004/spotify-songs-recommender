import json

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from recommender.engine import recommender

import os
from dotenv import load_dotenv

load_dotenv()

print(f"✅ FastAPI is listening on port {os.environ.get('PORT')}")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=[os.getenv("BACKEND_URL")],  # Or limit to ["https://your-node-backend.onrender.com"]
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
@app.head("/", include_in_schema=False)
async def health_check(request: Request):
    return {"message": "ML service is live",
            "allow_origins": os.getenv("BACKEND_URL"),
            "allow_credentials": True,
            "allow_methods": "*",
            "allow_headers": "*"}

@app.post("/recommend")
async def recommend(request: Request):
    print("📥 /recommend called")
    body = await request.json()
    print("🧠 Received body:", body)
    access_token = body.get("accessToken")
    preferences = body.get("preferences")

    try:
        result = recommender(access_token, preferences)
        return json.loads(result)
    except Exception as e:
        print("❌ Error in recommendation:", str(e))
        return {"error": "Recommendation engine failed", "details": str(e)}

# dummy endpoint to test POST requests
@app.post("/test-post")
async def test_post(request: Request):
    print("📨 /test-post hit")
    body = await request.json()
    print("📦 Body received:", body)
    return {"status": "success", "received": body}
