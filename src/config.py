"""Configuration settings and constants for the VisionCore CIFAR-10 classification project."""

import os
import sys
from pathlib import Path
import torch

# Ensure UTF-8 output on Windows consoles
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ==========================================
# Paths Configuration
# ==========================================
PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATA_DIR = PROJECT_ROOT / "data"
MODELS_DIR = PROJECT_ROOT / "models"
OUTPUTS_DIR = PROJECT_ROOT / "outputs"
PLOTS_DIR = OUTPUTS_DIR / "plots"
METRICS_DIR = OUTPUTS_DIR / "metrics"
NOTEBOOKS_DIR = PROJECT_ROOT / "notebooks"
APP_DIR = PROJECT_ROOT / "app"

# Ensure all critical output directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)
PLOTS_DIR.mkdir(parents=True, exist_ok=True)
METRICS_DIR.mkdir(parents=True, exist_ok=True)

# Model Checkpoint Paths
CNN_MODEL_PATH = MODELS_DIR / "best_cifar10_cnn.pth"
ANN_MODEL_PATH = MODELS_DIR / "baseline_ann.pth"

# Metric Output Paths
METRICS_JSON_PATH = METRICS_DIR / "metrics.json"
CLASSIFICATION_REPORT_PATH = METRICS_DIR / "classification_report.txt"
MODEL_COMPARISON_CSV_PATH = METRICS_DIR / "model_comparison.csv"

# Plot Output Paths
LOSS_CURVE_PATH = PLOTS_DIR / "loss_curve.png"
ACCURACY_CURVE_PATH = PLOTS_DIR / "accuracy_curve.png"
CONFUSION_MATRIX_PATH = PLOTS_DIR / "confusion_matrix.png"
NORM_CONFUSION_MATRIX_PATH = PLOTS_DIR / "normalized_confusion_matrix.png"
CLASS_DISTRIBUTION_PATH = PLOTS_DIR / "class_distribution.png"
CORRECT_PREDICTIONS_PATH = PLOTS_DIR / "correct_predictions.png"
INCORRECT_PREDICTIONS_PATH = PLOTS_DIR / "incorrect_predictions.png"
MODEL_COMPARISON_PLOT_PATH = PLOTS_DIR / "model_comparison.png"

# ==========================================
# Hardware / Device Configuration
# ==========================================
def get_device() -> torch.device:
    """Automatically detect and return the best available compute device (CUDA GPU, Apple MPS, or CPU)."""
    if torch.cuda.is_available():
        device = torch.device("cuda")
        device_name = torch.cuda.get_device_name(0)
        print(f"[Hardware] Using device: CUDA GPU ({device_name})")
    elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        device = torch.device("mps")
        print("[Hardware] Using device: Apple Silicon MPS")
    else:
        device = torch.device("cpu")
        print("[Hardware] Using device: CPU")
    return device

DEVICE = get_device()

# ==========================================
# Dataset & Label Specifications
# ==========================================
NUM_CLASSES = 10
IMAGE_SIZE = (32, 32)
IMAGE_CHANNELS = 3

# Official CIFAR-10 class labels in alphabetical order
CLASS_NAMES = [
    "airplane",
    "automobile",
    "bird",
    "cat",
    "deer",
    "dog",
    "frog",
    "horse",
    "ship",
    "truck"
]

CLASS_EMOJIS = {
    "airplane": "✈️",
    "automobile": "🚗",
    "bird": "🐦",
    "cat": "🐱",
    "deer": "🦌",
    "dog": "🐶",
    "frog": "🐸",
    "horse": "🐴",
    "ship": "🚢",
    "truck": "🚚"
}

# Standard CIFAR-10 per-channel mean and standard deviation for normalization
CIFAR10_MEAN = [0.4914, 0.4822, 0.4465]
CIFAR10_STD = [0.2470, 0.2435, 0.2616]

# ==========================================
# Training Hyperparameters
# ==========================================
RANDOM_SEED = 42
TRAIN_VAL_SPLIT_RATIO = 0.8  # 80% Train (40,000), 20% Val (10,000)

BATCH_SIZE = 64
NUM_WORKERS = 0  # 0 is safest across cross-platform Windows/macOS/Linux

# CNN Hyperparameters
CNN_EPOCHS = 18
CNN_LEARNING_RATE = 0.001
CNN_WEIGHT_DECAY = 1e-4

# Baseline ANN Hyperparameters
ANN_EPOCHS = 12
ANN_LEARNING_RATE = 0.001
ANN_WEIGHT_DECAY = 1e-4
