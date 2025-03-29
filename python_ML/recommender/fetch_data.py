import requests
import os
import dotenv

dotenv.load_dotenv()
backend_url = os.getenv("BACKEND_URL")

def fetch_user_playlists(access_token):
    # Call Spotify API directly instead of going through Express
    url = f"{backend_url}/api/get-playlists"
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
            
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()
        
def fetch_playlist_tracks(access_token, playlist_id):
    url = f"{backend_url}/api/playlist-tracks/{playlist_id}"
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()