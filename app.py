"""Hugging Face Spaces and Cloud Entrypoint for VisioNex FastAPI PyTorch Backend."""

import os
import uvicorn
from app.api_server import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
