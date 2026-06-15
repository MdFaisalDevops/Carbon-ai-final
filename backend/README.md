# CarbonMind AI — FastAPI Backend Service

This is the production-ready carbon intelligence reasoning engine and gamification scoring API.

## ⚡ Setup & Local Execution

1. Make sure Python 3.9+ is installed on your machine.
2. Open your terminal in this directory (`backend/`).
3. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
4. Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```
5. Set your OpenAI API key environment variable (optional, for GPT-4o-mini carbon advice):
   ```bash
   # On Windows (PowerShell):
   $env:OPENAI_API_KEY="your-api-key-here"
   # On macOS/Linux:
   export OPENAI_API_KEY="your-api-key-here"
   ```
6. Spin up the server using Uvicorn:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 10000 --reload
   ```
7. Open `http://localhost:10000/docs` in your browser to inspect and interact with the Swagger documentation.

---

## 🚀 Deployment Guide (Render)

1. Connect your GitHub repository to Render (https://render.com).
2. Click **New** -> **Web Service**.
3. Select your repository.
4. Set the following configuration parameters:
   - **Environment**: `Python`
   - **Root Directory**: `backend` (if in monorepo, else leave blank)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port 10000`
5. In **Environment Variables**, add:
   - `OPENAI_API_KEY` (Your OpenAI developer key, required for native AI reasoning. If left unset, the backend falls back to local carbon reasoning analytics).
6. Click **Deploy Web Service**. Render will build and host your API at `https://your-app-name.onrender.com`.
