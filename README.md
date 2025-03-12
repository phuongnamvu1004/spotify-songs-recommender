# Spotify Song Recommender Web

## Link: ...

## Project Description
### Overview
This is a Node.js-based web application which helps recommend Spotify songs from user data and customization options using Content-based Filtering Machine Learning algorithm

### Tech stack
- Runtime environment: Node.js
- Frontend:
    + Framework: Vue.js with Tailwind.css for styling
- Backend:
    + Framework: Express.js
    + Session management: Redis
    + DB: PostgreSQL
- Python Machine Learning for generating recommendations:
    + Libraries: sklearn, pandas, numpy
- Build tool: Vite
- Testing: Jest for Node.js and pytest for Python algorithm

### Machine Learning algorithm specifications
...

### Project setup
**Installing Node modules***
```bash
npm i # or
npm install
```

**Python setup**
```bash
# Create virtual environment with Python 3
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
npm run dev # running this command will run the frontend server and backend server concurrently, port 5173 for frontend and port 3000 (remember to prefix the routes with api/) for backend server
```



