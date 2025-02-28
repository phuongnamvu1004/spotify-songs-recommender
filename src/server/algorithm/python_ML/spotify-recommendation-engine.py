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
import requests

from dotenv import load_dotenv
import os
# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '../../../config/.env'))

# Get the access token from environment variables
ACCESS_TOKEN = os.getenv('ACCESS_TOKEN')

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
spotify_df['artists_song'] = spotify_df.apply(lambda row: row['artists_upd'][0]+row['name'], axis = 1)

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

### 2. Feature Engineering
"""
1. Normalize float variables
2. OHE Year and Popularity Variables
3. Create TF-IDF features off of artist genres
"""
# spotify_df['year'] = spotify_df['release_date'].apply(lambda x: x.split('/')[0])

float_cols = spotify_df.dtypes[spotify_df.dtypes == 'float64'].index.values

ohe_cols = 'popularity'

# print(spotify_df['popularity'].describe())

# create 5 point buckets for popularity 
spotify_df['popularity_red'] = spotify_df['popularity'].apply(lambda x: int(x/5))

# print(spotify_df.head())

#simple function to create OHE features
#this gets passed later on
def ohe_prep(df, column, new_name): 
    """ 
    Create One Hot Encoded features of a specific column

    Parameters: 
        df (pandas dataframe): Spotify Dataframe
        column (str): Column to be processed
        new_name (str): new column name to be used
        
    Returns: 
        tf_df: One hot encoded features 
    """
    
    tf_df = pd.get_dummies(df[column])
    feature_names = tf_df.columns
    tf_df.columns = [new_name + "|" + str(i) for i in feature_names]
    tf_df.reset_index(drop = True, inplace = True)    
    return tf_df

#function to build entire feature set
def create_feature_set(df, float_cols):
    """ 
    Process spotify df to create a final set of features that will be used to generate recommendations

    Parameters: 
        df (pandas dataframe): Spotify Dataframe
        float_cols (list(str)): List of float columns that will be scaled 
        
    Returns: 
        final: final set of features 
    """
    
    #tfidf genre lists
    # tfidf = TfidfVectorizer()
    # tfidf_matrix =  tfidf.fit_transform(df['consolidates_genre_lists'].apply(lambda x: " ".join(x)))
    # genre_df = pd.DataFrame(tfidf_matrix.toarray())
    # genre_df.columns = ['genre' + "|" + i for i in tfidf.get_feature_names()]
    # genre_df.reset_index(drop = True, inplace=True)

    #explicity_ohe = ohe_prep(df, 'explicit','exp')    
    year_ohe = ohe_prep(df, 'year','year') * 0.5
    popularity_ohe = ohe_prep(df, 'popularity_red','pop') * 0.15

    #scale float columns
    floats = df[float_cols].reset_index(drop = True)
    scaler = MinMaxScaler()
    floats_scaled = pd.DataFrame(scaler.fit_transform(floats), columns = floats.columns) * 0.2

    #concanenate all features
    # final = pd.concat([genre_df, floats_scaled, popularity_ohe, year_ohe], axis = 1)
    final = pd.concat([floats_scaled, popularity_ohe, year_ohe], axis = 1)
     
    #add song id
    final['id']=df['id'].values
    
    return final

complete_feature_set = create_feature_set(spotify_df, float_cols=float_cols)
# print(complete_feature_set.head())

### 3. Fetching user data from SpotifyAPI

def fetch_user_playlists():
    url = "http://localhost:3000/api/get-playlists"
    headers = {
        'Authorization': f'Bearer {ACCESS_TOKEN}'  # You need to pass the token somehow
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

user_playlists = fetch_user_playlists()
for playlist in user_playlists.items():
    print(playlist)
    print()
    # You can add more details as needed