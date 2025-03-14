# Spotify Song Recommender Web

## Link: ...

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
...

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



