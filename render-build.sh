#!/usr/bin/env bash
# Exit on error
set -e

echo "=== Installing Lightweight CPU PyTorch for Render Free Tier ==="
pip install --upgrade pip
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt

echo "=== Backend dependencies installed successfully ==="
