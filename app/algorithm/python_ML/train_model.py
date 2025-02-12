import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
import pickle

# Load dataset
df = pd.read_csv("../../db/spotify_data.csv")

# Extract necessary features (modify as needed)
features = ["danceability", "energy", "loudness", "valence", "tempo"]
X = df[features]

# Train a kNN model for song recommendations
model = NearestNeighbors(n_neighbors=10, algorithm="auto").fit(X)

# Save the trained model
with open("algorithm/model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved successfully!")