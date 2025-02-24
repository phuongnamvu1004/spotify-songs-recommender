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

### 1. Data Exploration/Preparation

spotify_df = sql_query([
    "acousticness", 
    "artists", 
    "danceability", 
    "duration_ms", 
    "energy", 
    "id", 
    "instrumentalness", 
    "key", 
    "liveness", 
    "loudness", 
    "mode", 
    "name", 
    "popularity", 
    "release_date",  # Add release_date to the query
    "speechiness", 
    "tempo", 
    "valence", 
    "year"
], "songs")

spotify_df['artists_upd_v1'] = spotify_df['artists'].apply(lambda x: re.findall(r"'([^']*)'", x))

# print(spotify_df['artists'].values[0])
# print(spotify_df['artists_upd_v1'].values[0][0])

spotify_df['artists_upd_v2'] = spotify_df['artists'].apply(lambda x: re.findall('\"(.*?)\"',x))
spotify_df['artists_upd'] = np.where(spotify_df['artists_upd_v1'].apply(lambda x: not x), spotify_df['artists_upd_v2'], spotify_df['artists_upd_v1'])

# need to create my own song identifier because there are duplicates of the same song with different ids
spotify_df['artists_song'] = spotify_df.apply(lambda row: row['artists_upd'][0]+row['name'],axis = 1)

spotify_df.sort_values(['artists_song','release_date'], ascending = False, inplace = True)

# print(spotify_df[spotify_df['name']=='Adore You'])

spotify_df.drop_duplicates('artists_song',inplace = True)

# print(spotify_df[spotify_df['name']=='Adore You'])

"""
Now I can explode this column and merge
"""
artists_exploded = spotify_df[['artists_upd','id']].explode('artists_upd')

# print(artists_exploded.head(10))
# print(spotify_df["artists_song"].head())

### Feature Engineering
"""
1. Normalize float variables
2. OHE Year and Popularity Variables
3. Create TF-IDF features off of artist genres
"""

