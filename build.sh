#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "=== [1/3] Installing Python Dependencies ==="
# Install CPU-specific PyTorch to keep slug size and memory footprint minimal on Render
pip install --upgrade pip
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt

echo "=== [2/3] Building React Frontend SPA ==="
cd frontend
npm install
npm run build
cd ..

echo "=== [3/3] Checking Model Checkpoint ==="
if [ ! -f "models/best_cifar10_cnn.pth" ]; then
    echo "Warning: models/best_cifar10_cnn.pth not found. Initializing pipeline..."
    python run.py --mode train --epochs 5 --batch-size 128
fi

echo "=== Deployment Build Completed Successfully! ==="
