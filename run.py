"""VisionCore Master CLI & Pipeline Orchestrator.

Provides a unified interface to run data exploration, model training (ANN/CNN),
rigorous test evaluation, visualization generation, and web deployment.

Usage:
    python run.py --mode full
    python run.py --mode train
    python run.py --mode train-ann
    python run.py --mode eval
    python run.py --mode explore
    python run.py --mode app
"""

import argparse
import subprocess
import sys
import time
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import matplotlib.pyplot as plt
import numpy as np
import torch
import torchvision

from src import config
from src.dataset import get_cifar10_datasets, get_dataset_class_counts
from src.evaluate import run_evaluation
from src.train import train_model
from src.utils import plot_class_distribution, set_seed


def run_exploration():
    """Perform dataset inspection, channel statistics, and class distribution visualization."""
    print("=" * 70)
    print("🔍 Running CIFAR-10 Dataset Exploration & Analysis")
    print("=" * 70)

    train_ds, val_ds, test_ds = get_cifar10_datasets()

    print(f"\n[1] Dataset Sample Counts:")
    print(f"    - Training Split (80%):   {len(train_ds):,} samples")
    print(f"    - Validation Split (20%): {len(val_ds):,} samples")
    print(f"    - Untouched Test Set:     {len(test_ds):,} samples")
    print(f"    - Total CIFAR-10 Samples: {len(train_ds) + len(val_ds) + len(test_ds):,} images")

    print(f"\n[2] Tensor & Dimension Specifications:")
    print(f"    - Image Shape:           {config.IMAGE_SIZE[0]} × {config.IMAGE_SIZE[1]} × {config.IMAGE_CHANNELS} (RGB)")
    print(f"    - Number of Classes:     {config.NUM_CLASSES}")
    print(f"    - Class Labels:          {', '.join(config.CLASS_NAMES)}")

    # Class distribution
    train_counts = get_dataset_class_counts(train_ds)
    print(f"\n[3] Training Set Class Distribution:")
    for cls_name, count in train_counts.items():
        print(f"    - {cls_name:12s}: {count:,} images")

    # Plot & Save Class Distribution
    plot_class_distribution(
        train_counts,
        save_path=config.CLASS_DISTRIBUTION_PATH,
        title="CIFAR-10 Training Split Class Distribution (40,000 samples)"
    )

    # Plot Random Sample Grid (5x5)
    print(f"\n[4] Generating 5x5 CIFAR-10 Exploration Grid...")
    raw_cifar = torchvision.datasets.CIFAR10(root=str(config.DATA_DIR), train=True, download=True)
    
    fig, axes = plt.subplots(5, 5, figsize=(10, 10), dpi=300)
    axes = axes.flatten()
    np.random.seed(config.RANDOM_SEED)
    rand_indices = np.random.choice(len(raw_cifar), size=25, replace=False)

    for i, idx in enumerate(rand_indices):
        img, label = raw_cifar[idx]
        axes[i].imshow(img)
        axes[i].set_title(f"{config.CLASS_NAMES[label].capitalize()}", fontsize=9, fontweight="bold")
        axes[i].axis("off")

    plt.suptitle("CIFAR-10 Random Dataset Samples with Ground Truth Labels", fontsize=13, fontweight="bold", y=0.98)
    sample_grid_path = config.PLOTS_DIR / "sample_exploration_grid.png"
    plt.tight_layout()
    fig.savefig(sample_grid_path, bbox_inches="tight")
    print(f"[Visualization] Saved exploration sample grid to: {sample_grid_path}")
    print("\n✅ Dataset Exploration Complete!")


def launch_api_server(port: int = 8000):
    """Launch the FastAPI PyTorch CNN inference backend."""
    import uvicorn
    print(f"\n🚀 Launching VisioNex FastAPI Backend at: http://localhost:{port}")
    print(f"   Swagger Docs: http://localhost:{port}/docs\n")
    uvicorn.run("app.api_server:app", host="0.0.0.0", port=port, reload=False)


def launch_frontend(port: int = 5173):
    """Launch the Vite React VisioNex frontend."""
    frontend_dir = config.PROJECT_ROOT / "frontend"
    print(f"\n🚀 Launching VisioNex React Frontend at: http://localhost:{port}")
    print(f"   Directory: {frontend_dir}\n")
    try:
        subprocess.run(["npm", "run", "dev", "--", "--port", str(port)], cwd=str(frontend_dir), shell=True)
    except KeyboardInterrupt:
        print("\n👋 Frontend server terminated by user.")


def launch_streamlit_app(port: int = 8501):
    """Launch the Streamlit web application."""
    app_path = config.APP_DIR / "streamlit_app.py"
    cmd = [sys.executable, "-m", "streamlit", "run", str(app_path), "--server.port", str(port)]
    print(f"\n🚀 Launching Streamlit App at: http://localhost:{port}")
    print(f"   Executing: {' '.join(cmd)}\n")
    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\n👋 Streamlit App terminated by user.")


def run_full_pipeline(
    cnn_epochs: int = config.CNN_EPOCHS,
    ann_epochs: int = config.ANN_EPOCHS,
    batch_size: int = config.BATCH_SIZE
):
    """Execute the complete end-to-end pipeline."""
    total_start = time.time()
    print("=" * 80)
    print("  🌟 VISIONCORE: CIFAR-10 COMPUTER VISION PIPELINE — END-TO-END EXECUTION 🌟")
    print("=" * 80)

    # Step 1: Exploration
    run_exploration()

    # Step 2: Baseline ANN Training
    print("\n" + "=" * 80)
    print("  STAGE 1: TRAINING BASELINE ARTIFICIAL NEURAL NETWORK (ANN)")
    print("=" * 80)
    train_model("ann", epochs=ann_epochs, batch_size=batch_size)

    # Step 3: VisionCore CNN Training
    print("\n" + "=" * 80)
    print("  STAGE 2: TRAINING VISIONCORE CONVOLUTIONAL NEURAL NETWORK (CNN)")
    print("=" * 80)
    train_model("cnn", epochs=cnn_epochs, batch_size=batch_size)

    # Step 4: Full Test Evaluation & Plots Generation
    print("\n" + "=" * 80)
    print("  STAGE 3: COMPREHENSIVE TEST SET EVALUATION & BENCHMARKING")
    print("=" * 80)
    run_evaluation()

    total_time = time.time() - total_start
    print("\n" + "=" * 80)
    print(f"🎉 VISIONCORE PIPELINE COMPLETED SUCCESSFULLY IN {total_time/60:.2f} MINUTES!")
    print(f"   • Model Checkpoint:  {config.CNN_MODEL_PATH}")
    print(f"   • Plots Generated:   {config.PLOTS_DIR}")
    print(f"   • Metrics Saved:     {config.METRICS_DIR}")
    print("=" * 80)
    print("👉 To launch the interactive web app, run:")
    print("   python run.py --mode app")
    print("   or: streamlit run app/streamlit_app.py\n")


def main():
    parser = argparse.ArgumentParser(
        description="VisionCore: CIFAR-10 Convolutional Neural Network Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--mode",
        type=str,
        default="full",
        choices=["full", "train", "train-ann", "eval", "explore", "app", "api", "frontend"],
        help="Pipeline execution mode."
    )
    parser.add_argument("--epochs", type=int, default=None, help="Override number of training epochs.")
    parser.add_argument("--batch-size", type=int, default=config.BATCH_SIZE, help="Mini-batch size.")
    parser.add_argument("--lr", type=float, default=None, help="Learning rate.")
    parser.add_argument("--port", type=int, default=None, help="Port for server (Streamlit/FastAPI/Frontend).")
    args = parser.parse_args()

    set_seed(config.RANDOM_SEED)

    if args.mode == "explore":
        run_exploration()
    elif args.mode == "train":
        epochs = args.epochs or config.CNN_EPOCHS
        lr = args.lr or config.CNN_LEARNING_RATE
        train_model("cnn", epochs=epochs, lr=lr, batch_size=args.batch_size)
    elif args.mode == "train-ann":
        epochs = args.epochs or config.ANN_EPOCHS
        lr = args.lr or config.ANN_LEARNING_RATE
        train_model("ann", epochs=epochs, lr=lr, batch_size=args.batch_size)
    elif args.mode == "eval":
        run_evaluation()
    elif args.mode == "app":
        port = args.port or 8501
        launch_streamlit_app(port=port)
    elif args.mode == "api":
        port = args.port or 8000
        launch_api_server(port=port)
    elif args.mode == "frontend":
        port = args.port or 5173
        launch_frontend(port=port)
    elif args.mode == "full":
        cnn_epochs = args.epochs or config.CNN_EPOCHS
        ann_epochs = 8 if args.epochs is None else args.epochs
        run_full_pipeline(cnn_epochs=cnn_epochs, ann_epochs=ann_epochs, batch_size=args.batch_size)


if __name__ == "__main__":
    main()
