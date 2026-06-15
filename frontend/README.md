# CarbonMind AI — React Frontend

This is the production-ready React frontend for CarbonMind AI.

## ⚡ Setup & Local Execution

1. Make sure Node.js (version 18+) is installed on your machine.
2. Open your terminal in this directory (`frontend/`).
3. Install project dependencies:
   ```bash
   npm install
   ```
4. Spin up the Vite local dev server:
   ```bash
   npm run dev
   ```
5. The console will display the running port (typically `http://localhost:3000`). Open it in your browser.

---

## 🌐 Frontend Deployment (Vercel)

1. Make sure your project folders are pushed to a Git repository (GitHub / GitLab / Bitbucket).
2. Connect your account to Vercel (https://vercel.com).
3. Click **Add New** -> **Project**.
4. Import your Git repository.
5. In the **Project Settings**:
   - Set **Framework Preset** to `Vite`.
   - Set **Root Directory** to `frontend`.
   - Leave the build command as `npm run build` and output directory as `dist`.
6. (Optional) If you want to connect to a live hosted FastAPI backend:
   - In `frontend/src/App.jsx`, configure the API request target from `http://localhost:10000` to your production backend URL.
7. Click **Deploy**. Vercel will build and launch your site!
