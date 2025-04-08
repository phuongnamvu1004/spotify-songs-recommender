import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ml_service_url = process.env.ML_SERVICE_URL;

export const getRecommendations = async (req, res) => {
  try {
    req.session.userData = req.session.userData || {};

    const currentPrefsString = JSON.stringify(req.session.userData?.preferences || {});
    const prevPrefsString = JSON.stringify(req.session.userData?.prevPreferences || {});

    console.log("🔄 Comparing preferences...");

    if (prevPrefsString === currentPrefsString && req.session.userData?.recommendedSongs) {
      console.log("✅ Using cached recommended songs");
      return res.json(req.session.userData.recommendedSongs);
    }

    console.log("🔁 Preferences changed — generating new recommendations");

    req.session.userData.prevPreferences = JSON.parse(currentPrefsString);

    const preferences = req.session.userData.preferences;
    const accessToken = req.session.access_token; // 👈 from session

    if (!accessToken) {
      return res.status(401).json({error: "User not authenticated."});
    }

    const responsePython = await axios.post(`${ml_service_url}/recommend`, {
      preferences, accessToken,
    });

    const result = responsePython.data;
    const trackIds = result.map((track) => track.id).join(",");

    const responseTrackInfo = await fetch(`https://api.spotify.com/v1/tracks?ids=${trackIds}`, {
      headers: {
        Authorization: `Bearer ${req.session.access_token}`,
      },
    });

    const data = await responseTrackInfo.json();

    const updatedTracks = result.map((track, index) => ({
      ...track, imgURL: data.tracks[index].album.images[0]?.url,
    }));

    req.session.userData.recommendedSongs = updatedTracks;

    res.json(updatedTracks);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({error: "Internal Server Error"});
  }
};

