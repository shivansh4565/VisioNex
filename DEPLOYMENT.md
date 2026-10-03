# 🚀 VisioNex Deployment Guide: Hosting on Render

This guide walks you through deploying **VisioNex** (PyTorch CNN CIFAR-10 Classifier + React Tailwind Frontend) to **Render** completely for free.

---

## 🏗️ Architecture Overview

VisioNex is configured for a **Unified Full-Stack Deployment** on Render:
- **Frontend**: Vite + React 18 + Tailwind CSS (built into static production files in `frontend/dist`)
- **Backend**: FastAPI + PyTorch CNN inference engine running on CPU
- **Routing**: FastAPI serves both the React Single Page App at `/` and the CNN inference endpoint at `/predict` and `/health` with automatic SPA client fallback.

---

## 📋 Prerequisites

1. A [GitHub](https://github.com) account.
2. A free account on [Render](https://render.com).
3. Git installed on your computer.

---

## Step 1: Push Your Code to GitHub

Open a terminal or PowerShell in your project root (`cifar10-cnn-classifier` or your project folder) and run:

```bash
# Initialize git repository (if not already done)
git init

# Add all project files
git add .

# Commit files
git commit -m "feat: complete VisioNex CNN project with Render deployment configs"

# Create a new repository on GitHub (e.g. named 'visionex-cifar10')
# Link your local repo to GitHub:
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/visionex-cifar10.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy on Render

### Option A: 1-Click / Blueprint Deployment (Recommended & Fastest)

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your GitHub repository `visionex-cifar10`.
4. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - **Service Name**: `visionex-cifar10`
   - **Environment**: `Python`
   - **Build Command**: `bash build.sh`
   - **Start Command**: `python -m uvicorn app.api_server:app --host 0.0.0.0 --port $PORT`
5. Click **Apply**.
6. Render will automatically install dependencies, build the React SPA, load the PyTorch CNN checkpoint, and deploy your live URL (e.g. `https://visionex-cifar10.onrender.com`).

---

### Option B: Manual Web Service Setup

If you prefer setting it up manually without Blueprint:

1. In Render Dashboard, click **New +** → **Web Service**.
2. Select **Build and deploy from a Git repository** and pick your repository.
3. Configure the following fields:
   - **Name**: `visionex-cifar10`
   - **Region**: Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     bash build.sh
     ```
   - **Start Command**:
     ```bash
     python -m uvicorn app.api_server:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   - `PYTHON_VERSION` = `3.10.12`
   - `NODE_VERSION` = `20.x`
5. Under **Advanced** → **Health Check Path**, enter:
   - `/health`
6. Click **Create Web Service**.

---

## Step 3: Verify Your Live App

Once the deployment status turns green (**Live**):

1. Click your Render URL (e.g. `https://visionex-cifar10.onrender.com`).
2. Test the **VisioNex** interface:
   - Navigate through Home, How It Works, and Dashboard.
   - Try the **1-Click sample test chips** (✈️ Airplane, 🚗 Automobile, 🐱 Cat, 🚢 Ship, 🐸 Frog).
   - Upload any custom image or photo to get instant PyTorch CNN predictions with Top-3 probabilities!
3. Verify the health check at `https://visionex-cifar10.onrender.com/health` (returns JSON status).

---

## ⚙️ How Render Handles Free Tier Sleeping

On Render's Free tier, the service may spin down after 15 minutes of inactivity. When a new visitor arrives, it automatically wakes up within ~30–45 seconds.

VisioNex is equipped with **automated local inference fallback**, ensuring the UI remains 100% responsive and informative during the initial cold start!

---

## 🛠️ Local Testing Before Pushing

You can test the exact production server locally by running:

```powershell
# Build frontend
cd frontend
npm run build
cd ..

# Run unified backend (serves both React frontend & FastAPI API on port 8000)
python -m uvicorn app.api_server:app --port 8000
```
Then visit `http://localhost:8000` in your browser!
