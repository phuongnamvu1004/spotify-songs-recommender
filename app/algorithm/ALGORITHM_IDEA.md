# Data we have
- 1,000,000 songs 
- User's data:
    + All playlists -> Playlist details in "/api/playlist-tracks/:playlistId"
    + Top tracks -> In "/api/top-tracks"
-> From these tracks we can get the metadata like in this code
```js
const fetch = require('node-fetch');

const accessToken = 'YOUR_SPOTIFY_ACCESS_TOKEN';
const trackId = 'TRACK_ID';

async function getTrackMetadata(trackId) {
  try {
    // Get track information
    const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const trackData = await trackResponse.json();

    // Get audio features
    const audioFeaturesResponse = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const audioFeaturesData = await audioFeaturesResponse.json();

    // Combine track information and audio features
    const trackMetadata = {
      artist_name: trackData.artists[0].name,
      track_name: trackData.name,
      track_id: trackData.id,
      popularity: trackData.popularity,
      year: new Date(trackData.album.release_date).getFullYear(),
      genre: trackData.album.genres, // Note: Spotify API does not directly provide genre for tracks
      danceability: audioFeaturesData.danceability,
      energy: audioFeaturesData.energy,
      key: audioFeaturesData.key,
      loudness: audioFeaturesData.loudness,
      mode: audioFeaturesData.mode,
      speechiness: audioFeaturesData.speechiness,
      acousticness: audioFeaturesData.acousticness,
      instrumentalness: audioFeaturesData.instrumentalness,
      liveness: audioFeaturesData.liveness,
      valence: audioFeaturesData.valence,
      tempo: audioFeaturesData.tempo,
      duration_ms: audioFeaturesData.duration_ms,
      time_signature: audioFeaturesData.time_signature,
    };

    console.log(trackMetadata);
  } catch (error) {
    console.error('Error fetching track metadata:', error);
  }
}

getTrackMetadata(trackId);
```

# Rules set up
## First pass (filtered by user's preferences)
- Selected criteria:
    + Artists
    + Genre
    + Tempo 
    + Year
    + Energy level
    + Duration (in ms)

## Second pass (training to find best match)
- Model training: Ref: "https://github.com/madhavthaker/spotify-recommendation-system"

## Repo setup

app/
├── algorithm/
│   ├── ALGORITHM_IDEA.md
│   ├── runAlgorithm.js
│   ├── train_model.py      # Training script
│   ├── model.pkl           # Saved trained model
├── client/
│   ├── App.vue
│   ├── views/
│   ├── main.js
│   ├── style.css
├── db/
│   ├── spotify_data.csv    # Dataset
│   ├── migrateFromBackend.js
│   ├── setupPostgres.js
├── server/
│   ├── index.js            # Node.js backend
│   ├── api.py              # FastAPI ML service
├── package.json
├── vite.config.js


**Steps:**
- Step 1: Install Required Python Packages
```bash 
pip install pandas numpy scikit-learn
```
- Step 2: Training Script (`algorithm/train_model.py`)
```py
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
import pickle

# Load dataset
df = pd.read_csv("db/spotify_data.csv")

# Extract necessary features (modify as needed)
features = ["danceability", "energy", "loudness", "valence", "tempo"]
X = df[features]

# Train a kNN model for song recommendations
model = NearestNeighbors(n_neighbors=10, algorithm="auto").fit(X)

# Save the trained model
with open("algorithm/model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved successfully!")
```
- Step 3: Modify API to Load Model (update `server/api.py` to use the trained model for recommendations)
```py
from fastapi import FastAPI
import pandas as pd
import numpy as np
import pickle
from pydantic import BaseModel

app = FastAPI()

# Load dataset and trained model
df = pd.read_csv("db/spotify_data.csv")
features = ["danceability", "energy", "loudness", "valence", "tempo"]

try:
    with open("algorithm/model.pkl", "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    model = None

# Request schema
class RecommendationRequest(BaseModel):
    track_id: str  # Assume user selects a track

# API endpoint
@app.post("/recommend")
def recommend(request: RecommendationRequest):
    if model is None:
        return {"error": "Model not trained"}

    # Find the requested song in the dataset
    song = df[df["track_id"] == request.track_id]
    if song.empty:
        return {"error": "Track not found"}

    # Get song features and find nearest neighbors
    song_features = song[features].values
    _, indices = model.kneighbors(song_features)

    # Get recommended track IDs
    recommended_songs = df.iloc[indices[0]]["track_id"].tolist()

    return {"track_id": request.track_id, "recommendations": recommended_songs}
```
- Step 4: Updating `package.json` to Run fastAPI alongside Node.js
```js
"scripts": {
  "dev": "concurrently \"nodemon server/index.js\" \"vite\" \"uvicorn server.api:app --reload --host 0.0.0.0 --port 8000\"",
  "build": "vite build",
  "preview": "node index.js"
}
```
- Start Vue frontend at http://localhost:5173 (or another Vite port).
- Start Node.js API at http://localhost:3000.
- Start FastAPI recommendation engine at http://localhost:8000.







