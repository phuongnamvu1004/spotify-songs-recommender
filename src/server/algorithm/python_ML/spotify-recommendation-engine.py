from sklearn.neighbors import NearestNeighbors
import pickle
import os
from fetch_data import sql_query
from constants import PROJECT_ROOT

# Extract necessary features (modify as needed)
features = ["danceability", "energy", "loudness", "valence", "tempo"]
X = sql_query(features, "spotify_db") 

# Train a kNN model for song recommendations
model = NearestNeighbors(n_neighbors=10, algorithm="auto").fit(X)

# Save the trained model using absolute path
model_path = os.path.join(PROJECT_ROOT, "src/server/algorithm/python_ML/model.pkl")
with open(model_path, "wb") as f:
    pickle.dump(model, f)

print(f"Model trained and saved successfully at {model_path}!")
