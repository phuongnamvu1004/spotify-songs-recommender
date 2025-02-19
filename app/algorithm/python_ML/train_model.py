import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
import pickle
import os

# Get the absolute path to the project root
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))

# Load dataset using absolute path
df = pd.read_csv(os.path.join(PROJECT_ROOT, "db/spotify_data.csv"))

# Extract necessary features (modify as needed)
features = ["danceability", "energy", "loudness", "valence", "tempo"]
X = df[features]

# Train a kNN model for song recommendations
model = NearestNeighbors(n_neighbors=10, algorithm="auto").fit(X)

# Save the trained model using absolute path
model_path = os.path.join(PROJECT_ROOT, "app/algorithm/python_ML/model.pkl")
with open(model_path, "wb") as f:
    pickle.dump(model, f)

print(f"Model trained and saved successfully at {model_path}!")