import json
import pandas as pd
import numpy as np
import re 
import sys

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler

from fetch_data import fetch_all_data_in_batches
import requests

# Get the access token from command line arguments
ACCESS_TOKEN = sys.argv[1]
preferences = sys.argv[2]

def main():
    ### 1. Data Exploration/Preparation
    # Fetch all rows from the "songs" table
    spotify_df = fetch_all_data_in_batches([
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
        "release_date", 
        "speechiness", 
        "tempo", 
        "valence", 
        "year"
    ], "songs", batch_size=5000)

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

    # simple function to create OHE features
    # this gets passed later on
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

        #explicity_ohe = ohe_prep(df, 'explicit','exp')    
        year_ohe = ohe_prep(df, 'year','year') * 0.5
        popularity_ohe = ohe_prep(df, 'popularity_red','pop') * 0.15

        #scale float columns
        floats = df[float_cols].reset_index(drop = True)
        scaler = MinMaxScaler()
        floats_scaled = pd.DataFrame(scaler.fit_transform(floats), columns = floats.columns) * 0.2

        #concanenate all features
        final = pd.concat([floats_scaled, popularity_ohe, year_ohe], axis = 1)
        
        #add song id
        final['id'] = df['id'].values
        
        return final

    complete_feature_set = create_feature_set(spotify_df, float_cols=float_cols)
    # print(complete_feature_set.head())

    ### 3. Fetching user data from SpotifyAPI

    ## Fetching user playlists
    def fetch_user_playlists():
        # Call Spotify API directly instead of going through Express
        url = "https://api.spotify.com/v1/me/playlists"
        headers = {
            'Authorization': f'Bearer {ACCESS_TOKEN}'
        }
                
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching playlists: {response.status_code}")
            print(f"Response text: {response.text}")
            response.raise_for_status()

    user_playlists = fetch_user_playlists()
    playlist_names = [item['name'] for item in user_playlists['items']]
    # print(playlist_names)

    def fetch_playlist_tracks(playlist_id):
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        headers = {
            'Authorization': f'Bearer {ACCESS_TOKEN}'
        }
        
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching playlist tracks: {response.status_code}")
            print(f"Response text: {response.text}")
            response.raise_for_status()
        
    def create_necessary_outputs(playlist_name, id_dic, df):
        """ 
        Pull songs from a specific playlist.

        Parameters: 
            playlist_name (str): name of the playlist you'd like to pull from the spotify API
            id_dic (dic): dictionary that maps playlist_name to playlist_id
            df (pandas dataframe): spotify dataframe
            
        Returns: 
            playlist: all songs in the playlist THAT ARE AVAILABLE IN THE DATASET
        """
        
        # Generate playlist dataframe
        playlist = pd.DataFrame()
        playlist_id = id_dic[playlist_name]

        tracks = fetch_playlist_tracks(playlist_id)['items']
        for ix, item in enumerate(tracks):
            track = item['track']
            playlist.loc[ix, 'artist'] = track['artists'][0]['name']
            playlist.loc[ix, 'name'] = track['name']
            playlist.loc[ix, 'id'] = track['id']
            playlist.loc[ix, 'url'] = track['album']['images'][1]['url']
            playlist.loc[ix, 'date_added'] = item['added_at']

        playlist['date_added'] = pd.to_datetime(playlist['date_added'])  
        playlist = playlist[playlist['id'].isin(df['id'].values)].sort_values('date_added', ascending=False)
        
        return playlist

    id_dic = {playlist['name']: playlist['id'] for playlist in user_playlists['items']}

    all_songs_in_playlists = pd.DataFrame()
    for playlist_name in playlist_names:
        playlist = create_necessary_outputs(playlist_name, id_dic, spotify_df)
        all_songs_in_playlists = pd.concat([all_songs_in_playlists, playlist])
        # print(f"Necessary outputs for {playlist_name}")
        # print(playlist)
        # print()

    ### 4. Create playlist vectors
        
    def generate_playlist_feature(complete_feature_set, playlist_df, weight_factor):
        """ 
        Summarize a user's playlist into a single vector

        Parameters: 
            complete_feature_set (pandas dataframe): Dataframe which includes all of the features for the spotify songs
            playlist_df (pandas dataframe): playlist dataframe
            weight_factor (float): float value that represents the recency bias. The larger the recency bias, the most priority recent songs get. Value should be close to 1. 
            
        Returns: 
            playlist_feature_set_weighted_final (pandas series): single feature that summarizes the playlist
            complete_feature_set_nonplaylist (pandas dataframe): 
        """
        
        complete_feature_set_playlist = complete_feature_set[complete_feature_set['id'].isin(playlist_df['id'].values)]#.drop('id', axis = 1).mean(axis =0)
        complete_feature_set_playlist = complete_feature_set_playlist.merge(playlist_df[['id','date_added']], on = 'id', how = 'inner')
        complete_feature_set_nonplaylist = complete_feature_set[~complete_feature_set['id'].isin(playlist_df['id'].values)]#.drop('id', axis = 1)
        
        playlist_feature_set = complete_feature_set_playlist.sort_values('date_added',ascending=False)

        most_recent_date = playlist_feature_set.iloc[0,-1]
        
        for ix, row in playlist_feature_set.iterrows():
            playlist_feature_set.loc[ix,'months_from_recent'] = int((most_recent_date.to_pydatetime() - row.iloc[-1].to_pydatetime()).days / 30)
            
        playlist_feature_set['weight'] = playlist_feature_set['months_from_recent'].apply(lambda x: weight_factor ** (-x))
        
        playlist_feature_set_weighted = playlist_feature_set.copy()
        #print(playlist_feature_set_weighted.iloc[:,:-4].columns)
        playlist_feature_set_weighted.update(playlist_feature_set_weighted.iloc[:,:-4].mul(playlist_feature_set_weighted.weight,0))
        playlist_feature_set_weighted_final = playlist_feature_set_weighted.iloc[:, :-4]
        
        return playlist_feature_set_weighted_final.sum(axis = 0), complete_feature_set_nonplaylist

    complete_feature_set_playlist_vector_all, complete_feature_set_nonplaylist_all = generate_playlist_feature(complete_feature_set, all_songs_in_playlists, 1.09)

    # print(complete_feature_set_playlist_vector_soul.shape)

    ### 5. Generate Recommendations 
    def filter_by_preferences(df, preferences):
        """ 
        Filter songs based on user preferences of this JSON (or python dictionary) format:
        {
            artists: List[str],
            acousticness: bool,
            year: {
                start: int,
                end: int
            },
            duration: {
                start: int,
                end: int,
            },
            tempo: {
                start: int,
                end: int,
            },
        }
        
        Parameters: 
            df (pandas dataframe): spotify dataframe
            preferences (JSON format): user preferences
            
        Returns:
            df: filtered dataframe
        """
        # Convert preferences to a dictionary if it's a JSON string
        if isinstance(preferences, str):
            preferences = json.loads(preferences)
        
        # Filter by artists
        if 'artists' in preferences:
            df = df[df['artists_upd'].apply(lambda x: any(artist in x for artist in preferences['artists']))]
                  
        # Filter by year
        if 'year' in preferences:
            df = df[(df['year'] >= preferences['year']['start']) & (df['year'] <= preferences['year']['end'])]
        
        # Filter by duration
        if 'duration' in preferences:
            df = df[(df['duration_ms'] >= preferences['duration']['start']) & (df['duration_ms'] <= preferences['duration']['end'])]
        
        # Filter by acousticness, if acoustice is True, then we want songs that are more acoustic (acousticness >= 0.5) else we want songs that are less acoustic (acousticness < 0.5)
        if 'acousticness' in preferences:
            if preferences['acousticness']:
                df['sim'] = df.apply(
                    lambda row: row['sim'] * 1.5 if row['acousticness'] >= 0.5 else row['sim'], 
                    axis=1
                )  
            else:
                df['sim'] = df.apply(
                    lambda row: row['sim'] * 1.5 if row['acousticness'] < 0.5 else row['sim'], 
                    axis=1
                )
        
        # Filter by tempo
        if 'tempo' in preferences:
            df = df[(df['tempo'] >= preferences['tempo']['start']) & (df['tempo'] <= preferences['tempo']['end'])]
        
        return df
    
    def generate_playlist_recos(df, features, nonplaylist_features):
        """ 
        Pull songs from a specific playlist.

        Parameters: 
            df (pandas dataframe): spotify dataframe
            features (pandas series): summarized playlist feature
            nonplaylist_features (pandas dataframe): feature set of songs that are not in the selected playlist
            
        Returns: 
            non_playlist_df_top_50: Top 50 recommendations for that playlist
        """
        
        # Create a new DataFrame instead of a view
        non_playlist_df = df[df['id'].isin(nonplaylist_features['id'].values)].copy()
        
        # Calculate similarities
        similarities = cosine_similarity(nonplaylist_features.drop('id', axis=1).values, 
                                       features.values.reshape(1, -1))[:,0]
        
        # Assign similarities to the DataFrame
        non_playlist_df['sim'] = similarities
        
        # Get top 50 recommendations
        non_playlist_df_sorted = non_playlist_df.sort_values('sim', ascending=False)
        non_playlist_df_top_50 = filter_by_preferences(non_playlist_df_sorted, preferences).head(50)
        
        return non_playlist_df_top_50

    top50 = generate_playlist_recos(spotify_df, complete_feature_set_playlist_vector_all, complete_feature_set_nonplaylist_all)

    print(top50.to_json(orient='records'))
    
if __name__ == "__main__":
    main()