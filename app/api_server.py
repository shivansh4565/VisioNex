"""VisioNex REST API Backend Server powered by FastAPI and PyTorch.

Exposes the trained VisionCore CNN model over HTTP for real-time frontend integration.
"""

import io
from pathlib import Path
import os
import sys
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from PIL import Image

# Ensure project root in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src import config
from src.predict import VisionCorePredictor

app = FastAPI(
    title="VisioNex CNN Prediction API",
    description="PyTorch Convolutional Neural Network API for CIFAR-10 Image Classification",
    version="1.0.0"
)

# Enable CORS for frontend clients (Vite dev on 5173, 3000, 8000, Render domains, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor singleton
predictor = None

@app.on_event("startup")
def load_model():
    global predictor
    try:
        predictor = VisionCorePredictor(model_path=config.CNN_MODEL_PATH)
        print(f"[API Server] Loaded PyTorch VisionCore CNN model on {config.DEVICE}")
    except Exception as e:
        print(f"[API Server Warning] Model not loaded yet: {str(e)}")

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "device": str(config.DEVICE),
        "model_loaded": predictor is not None,
        "classes": config.CLASS_NAMES
    }

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    global predictor
    if predictor is None:
        try:
            predictor = VisionCorePredictor(model_path=config.CNN_MODEL_PATH)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Model checkpoint not ready: {str(e)}. Please train the model first."
            )

    try:
        image_bytes = await file.read()
        pil_image = Image.open(io.BytesIO(image_bytes))
        result = predictor.predict(pil_image, top_k=3)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")

# Mount production React SPA if built in frontend/dist
DIST_DIR = PROJECT_ROOT / "frontend" / "dist"
if (DIST_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # If file exists in dist (e.g. favicon, vite.svg), serve it directly
    if full_path:
        candidate = DIST_DIR / full_path
        if candidate.exists() and candidate.is_file():
            return FileResponse(candidate)
    
    # Fallback to index.html for client-side routing
    index_file = DIST_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    
    return {
        "message": "VisioNex API Server is running. Visit /docs for API documentation or build the frontend with 'cd frontend && npm run build'."
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.api_server:app", host="0.0.0.0", port=port, reload=False)
