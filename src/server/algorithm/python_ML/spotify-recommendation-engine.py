import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
import pickle
import os
import sys

try:
    # Get the absolute path to the project root (4 levels up from current file)
    PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../"))
    
    print(f"Project root path: {PROJECT_ROOT}")  # Debug print
    
    # Verify pandas is installed
    print(f"Pandas version: {pd.__version__}")
    
    # Load dataset using absolute path
    data_path = os.path.join(PROJECT_ROOT, "src/server/algorithm/db/spotify_data.csv")
    print(f"Attempting to load data from: {data_path}")  # Debug print
    
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found at {data_path}")
        
    df = pd.read_csv(data_path)

    # Extract necessary features (modify as needed)
    features = ["danceability", "energy", "loudness", "valence", "tempo"]
    X = df[features]

    # Train a kNN model for song recommendations
    model = NearestNeighbors(n_neighbors=10, algorithm="auto").fit(X)

    # Save the trained model using absolute path
    model_path = os.path.join(PROJECT_ROOT, "src/server/algorithm/python_ML/model.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(model, f)

    print(f"Model trained and saved successfully at {model_path}!")

except Exception as e:
    print(f"Error occurred: {str(e)}")
    print(f"Python path: {sys.path}")  # Show Python path for debugging
    sys.exit(1)