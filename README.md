# Spotify Song Recommender Web

<br>

## Link: ...

<br>

## Project Description
### Overview
This is a Node.js-based web application which helps recommend Spotify songs from user data and customization options using Content-based Filtering Machine Learning algorithm

### Tech stack
**Frontend:**
- Vue.js 3
- Tailwind CSS
- Vite (build tool)
- Jest (unit testing)

**Backend:**
- Node.js runtime
- Express.js framework
- PostgreSQL (primary database)
- Redis (session management, caching)
- Jest (API testing)

**ML Service:**
- Python 3.x
- Core libraries:
  - scikit-learn
  - pandas
  - numpy
- pytest (testing)

**DevOps/Infrastructure:**
- Docker
- Git version control
- CI/CD (specify platform if any: GitHub Actions, Jenkins, etc.)

**Package Managers:**
- npm/bun (JavaScript)
- pip (Python)

### Machine Learning algorithm specifications
**Dataset used**
Kaggle 160k Spotify songs from 1921 to 2020 (Sorted):
- Link: https://www.kaggle.com/datasets/fcpercival/160k-spotify-songs-sorted?resource=download

The Machine Learning algorithm used in the recommendation system is Content-based Filtering algorithm (CBF), conducting in 5 steps:
**Step 1: Data Exploration/Preparation**
- Cleaning data (mostly for the "artist" column since it is not in this algorithm desired format)

**Step 2: Feature Engineering**
- Normalize continuous variables (e.g., acousticness, energy, tempo).
- Apply One-Hot Encoding (OHE) to categorical variables such as Year and Popularity.
- Generate TF-IDF (Term Frequency-Inverse Document Frequency) features for artist genres to capture textual information.
**Step 3: Fetching user data from SpotifyAPI**
- Retrieve user-specific data, such as playlists and listening history, via API routes defined in the Express backend server (running on port 3000)

**Step 4: Create playlist vectors**
- Summarize a user's playlist into a single vector by aggregating features of all songs in the playlist. This vector represents the user's music preferences.

**Step 5: Generate Recommendations**
- Compute similarity scores between the user's playlist vector and all other songs in the dataset using cosine similarity.
- Rank the songs in descending order of similarity and return the Top 50 recommendations.

### Project setup
**Installing Node modules***
```bash
npm i # or
npm install
```

**Python setup**
```bash
# Create virtual environment with Python3
python3 -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Upgrade pip
python3 -m pip install --upgrade pip

# Install dependencies
python3 -m pip install -r requirements.txt

# Running Python Scripts: Make sure venv is activated, then
python3 src/server/algorithm/python_ML/spotify-recommendation-engine.py
```

**Running server on localhost**
```bash
# running this command will run the frontend server and backend server concurrently with:
# - port 5173 for frontend  
# - port 3000 (remember to prefix the routes with /api/) for backend server
npm run dev 
```



