import pandas as pd
import numpy as np
import json
import re 
import sys
import itertools

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

from fetch_data import sql_query

df = sql_query(["acousticness", "artist_name", "danceability", "duration_ms", "energy", "track_id", "instrumentalness", "key", "liveness", "loudness", "mode", "track_name", "popularity", "speechiness", "tempo", "valence", "year", "genre"], "Songs", 10000)

print(df.head())

"""
Observations:
1. This data is at a song level
2. Many numerical values that I'll be able to use to compare movies (liveness, tempo, valence, etc)
3. "Year" will useful but I'll need to create a OHE variable for release date in 5 year increments
4. Similar to 2, I'll need to create OHE variables for the popularity. I'll also use 5 year increments here
"""

print(df.dtypes)