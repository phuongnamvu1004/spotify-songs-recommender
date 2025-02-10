# Data we have
- 1,000,000 songs 
- User's data:
    - All playlists -> Playlist details in "/api/playlist-tracks/:playlistId"
    - Top tracks -> In "/api/top-tracks"
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

