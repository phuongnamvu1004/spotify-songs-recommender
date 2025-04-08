// import { spawn } from "child_process";
// import path from "path";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ml_service_url = process.env.ML_SERVICE_URL;

export const getRecommendations = async (req, res) => {
  try {
    const preferences = req.session.userData.preferences;
    const accessToken = req.session.access_token; // 👈 from session

    if (!accessToken) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    console.log("preferences: ", preferences);
    console.log("accessToken: ", accessToken);

    const response = await axios.post(`${ml_service_url}/recommend`, {
      preferences,
      accessToken,
    });

    console.log("Response data type:", typeof response.data);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getRecommendedSongs = async (req, res) => {
//   try {
//     console.log("🚀 [GET /recommended-songs] Route triggered");
//     console.log("🧠 Access Token:", req.session.access_token);
//     console.log("🎛️  Preferences:", req.session.userData?.preferences);
//     console.log("📦 Previous Preferences:", req.session.userData?.prevPreferences);

//     req.session.userData = req.session.userData || {};

//     const currentPrefsString = JSON.stringify(req.session.userData?.preferences || {});
//     const prevPrefsString = JSON.stringify(req.session.userData?.prevPreferences || {});

//     console.log("🔄 Comparing preferences...");

//     if (
//       prevPrefsString === currentPrefsString &&
//       req.session.userData?.recommendedSongs
//     ) {
//       console.log("✅ Using cached recommended songs");
//       return res.json(req.session.userData.recommendedSongs);
//     }

//     console.log("🔁 Preferences changed — generating new recommendations");

//     req.session.userData.prevPreferences = JSON.parse(currentPrefsString);

//     const scriptPath = path.join(
//       __dirname,
//       "../algorithm/python_ML/spotify-recommendation-engine.py"
//     );

//     console.log("🐍 Spawning Python script:", scriptPath);
//     const pythonProcess = spawn("python3", [
//       scriptPath,
//       req.session.access_token,
//       currentPrefsString,
//     ]);

//     let scriptOutput = "";

//     pythonProcess.stdout.on("data", (data) => {
//       console.log("📥 Python stdout chunk received");
//       scriptOutput += data.toString();
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       console.error("⚠️ Python stderr:", data.toString());
//     });

//     pythonProcess.on("close", async (code) => {
//       console.log("🚪 Python process closed with code:", code);
//       if (code !== 0) {
//         return res.status(500).json({ error: "Python script failed" });
//       }

//       try {
//         let trackIds;
//         let result;
//         const startTag = "[[JSON_OUTPUT_START]]";
//         const endTag = "[[JSON_OUTPUT_END]]";

//         const startIdx = scriptOutput.indexOf(startTag);
//         const endIdx = scriptOutput.indexOf(endTag);

//         if (startIdx !== -1 && endIdx !== -1) {
//           const rawJson = scriptOutput.slice(startIdx + startTag.length, endIdx).trim();
//           result = JSON.parse(rawJson);
//           trackIds = result.map((track) => track.id).join(",");
//           console.log("🎶 Track IDs:", trackIds);
//         } else {
//           throw new Error("Could not find JSON output markers in Python output");
//         }

//         const response = await fetch(
//           `https://api.spotify.com/v1/tracks?ids=${trackIds}`,
//           {
//             headers: {
//               Authorization: `Bearer ${req.session.access_token}`,
//             },
//           }
//         );
//         const data = await response.json();

//         const updatedTracks = result.map((track, index) => ({
//           ...track,
//           imgURL: data.tracks[index].album.images[0]?.url,
//         }));

//         console.log("✅ Tracks enriched with images");

//         req.session.userData.recommendedSongs = updatedTracks;

//         req.session.save((err) => {
//           if (err) {
//             console.error("❌ Session save error:", err);
//             return res.status(500).json({ error: "Failed to save session data" });
//           }
//           console.log("📦 Session saved — sending recommendations to frontend");
//           res.json(updatedTracks);
//         });
//       } catch (error) {
//         console.error("❌ Error processing Python results:", error);
//         res.status(500).json({ error: "Failed to process recommended songs" });
//       }
//     });
//   } catch (error) {
//     console.error("❌ General error in /recommended-songs:", error);
//     res.status(500).json({ error: "Failed to process recommended songs" });
//   }
// };
