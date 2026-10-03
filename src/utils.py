"""Utility functions for reproducibility, dataset mapping, visualizations, metrics, and checkpointing."""

import json
import random
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import torch
import torch.nn as nn
from PIL import Image

from src import config

# Set styling for plots
sns.set_theme(style="whitegrid")
plt.rcParams["font.family"] = "sans-serif"
plt.rcParams["font.size"] = 10


def set_seed(seed: int = config.RANDOM_SEED) -> None:
    """Ensure full reproducibility by seeding Python, NumPy, and PyTorch random generators."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False


def idx_to_class(idx: int) -> str:
    """Convert an integer class index (0-9) to its readable CIFAR-10 class name."""
    if 0 <= idx < len(config.CLASS_NAMES):
        return config.CLASS_NAMES[idx]
    raise ValueError(f"Index {idx} out of range for CIFAR-10 (0-9).")


def class_to_idx(class_name: str) -> int:
    """Convert a CIFAR-10 class name to its integer index."""
    name_clean = class_name.lower().strip()
    if name_clean in config.CLASS_NAMES:
        return config.CLASS_NAMES.index(name_clean)
    raise ValueError(f"Unknown class name: '{class_name}'. Expected one of {config.CLASS_NAMES}")


def get_class_names() -> List[str]:
    """Return a copy of all CIFAR-10 class names."""
    return list(config.CLASS_NAMES)


def get_class_emoji(class_name: str) -> str:
    """Return the associated emoji for a class name."""
    return config.CLASS_EMOJIS.get(class_name.lower().strip(), "🏷️")


def denormalize(tensor: torch.Tensor) -> np.ndarray:
    """Convert a normalized PyTorch tensor (C, H, W) back to an RGB image array (H, W, C) in [0, 1]."""
    tensor = tensor.detach().cpu().clone()
    mean = torch.tensor(config.CIFAR10_MEAN).view(3, 1, 1)
    std = torch.tensor(config.CIFAR10_STD).view(3, 1, 1)
    tensor = tensor * std + mean
    tensor = torch.clamp(tensor, 0.0, 1.0)
    image_np = tensor.permute(1, 2, 0).numpy()
    return image_np


def tensor_to_pil(tensor: torch.Tensor) -> Image.Image:
    """Convert a normalized PyTorch tensor into a PIL Image."""
    np_img = denormalize(tensor)
    uint8_img = (np_img * 255).astype(np.uint8)
    return Image.fromarray(uint8_img)


def plot_loss_curves(
    train_losses: List[float],
    val_losses: List[float],
    save_path: Optional[Path] = None,
    title: str = "Training & Validation Loss"
) -> plt.Figure:
    """Plot and save training vs validation loss curves."""
    epochs = range(1, len(train_losses) + 1)
    fig, ax = plt.subplots(figsize=(8, 5), dpi=300)
    
    ax.plot(epochs, train_losses, marker="o", color="#1f77b4", linewidth=2, label="Train Loss")
    ax.plot(epochs, val_losses, marker="s", color="#ff7f0e", linewidth=2, linestyle="--", label="Validation Loss")
    
    ax.set_title(title, fontsize=14, fontweight="bold", pad=12)
    ax.set_xlabel("Epoch", fontsize=11, fontweight="bold")
    ax.set_ylabel("CrossEntropy Loss", fontsize=11, fontweight="bold")
    ax.legend(frameon=True, facecolor="white", edgecolor="none", shadow=True)
    ax.grid(True, linestyle=":", alpha=0.6)
    
    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, bbox_inches="tight")
        print(f"[Visualization] Saved loss curve to: {save_path}")
    return fig


def plot_accuracy_curves(
    train_accs: List[float],
    val_accs: List[float],
    save_path: Optional[Path] = None,
    title: str = "Training & Validation Accuracy"
) -> plt.Figure:
    """Plot and save training vs validation accuracy curves."""
    epochs = range(1, len(train_accs) + 1)
    fig, ax = plt.subplots(figsize=(8, 5), dpi=300)
    
    ax.plot(epochs, train_accs, marker="o", color="#2ca02c", linewidth=2, label="Train Accuracy")
    ax.plot(epochs, val_accs, marker="^", color="#d62728", linewidth=2, linestyle="--", label="Validation Accuracy")
    
    ax.set_title(title, fontsize=14, fontweight="bold", pad=12)
    ax.set_xlabel("Epoch", fontsize=11, fontweight="bold")
    ax.set_ylabel("Accuracy (%)", fontsize=11, fontweight="bold")
    ax.legend(frameon=True, facecolor="white", edgecolor="none", shadow=True, loc="lower right")
    ax.grid(True, linestyle=":", alpha=0.6)
    
    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, bbox_inches="tight")
        print(f"[Visualization] Saved accuracy curve to: {save_path}")
    return fig


def plot_confusion_matrix(
    y_true: Union[List[int], np.ndarray],
    y_pred: Union[List[int], np.ndarray],
    classes: List[str],
    save_path: Optional[Path] = None,
    normalize: bool = False,
    title: Optional[str] = None
) -> plt.Figure:
    """Compute, render, and save a clean Confusion Matrix."""
    from sklearn.metrics import confusion_matrix
    
    cm = confusion_matrix(y_true, y_pred)
    if normalize:
        cm_display = cm.astype("float") / cm.sum(axis=1)[:, np.newaxis]
        fmt = ".2f"
        plot_title = title or "Normalized Confusion Matrix (CIFAR-10 Test Set)"
    else:
        cm_display = cm
        fmt = "d"
        plot_title = title or "Confusion Matrix (CIFAR-10 Test Set)"
        
    fig, ax = plt.subplots(figsize=(10, 8), dpi=300)
    cmap = "Blues" if not normalize else "viridis"
    
    sns.heatmap(
        cm_display,
        annot=True,
        fmt=fmt,
        cmap=cmap,
        xticklabels=classes,
        yticklabels=classes,
        cbar=True,
        linewidths=0.5,
        linecolor="white",
        ax=ax
    )
    
    ax.set_title(plot_title, fontsize=14, fontweight="bold", pad=15)
    ax.set_xlabel("Predicted Class", fontsize=12, fontweight="bold")
    ax.set_ylabel("Actual (Ground Truth) Class", fontsize=12, fontweight="bold")
    plt.xticks(rotation=45, ha="right", fontsize=10)
    plt.yticks(rotation=0, fontsize=10)
    
    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, bbox_inches="tight")
        print(f"[Visualization] Saved confusion matrix to: {save_path}")
    return fig


def plot_sample_predictions(
    images: List[torch.Tensor],
    y_true: List[int],
    y_pred: List[int],
    confidences: List[float],
    classes: List[str],
    save_path: Optional[Path] = None,
    correct: bool = True,
    max_samples: int = 10
) -> plt.Figure:
    """Plot a grid of sample predictions (either correct or incorrect) with labels and confidence."""
    num_samples = min(len(images), max_samples)
    cols = 5
    rows = int(np.ceil(num_samples / cols))
    
    fig, axes = plt.subplots(rows, cols, figsize=(15, 3.5 * rows), dpi=300)
    axes = np.array(axes).reshape(-1)
    
    status_label = "Correct" if correct else "Misclassified (Incorrect)"
    color = "#2ca02c" if correct else "#d62728"
    
    for i in range(num_samples):
        ax = axes[i]
        img_np = denormalize(images[i])
        ax.imshow(img_np)
        ax.axis("off")
        
        actual_name = classes[y_true[i]]
        pred_name = classes[y_pred[i]]
        conf = confidences[i] * 100
        
        if correct:
            label_text = f"True & Pred: {actual_name}\nConf: {conf:.1f}%"
        else:
            label_text = f"Actual: {actual_name}\nPred: {pred_name}\nConf: {conf:.1f}%"
            
        ax.set_title(label_text, fontsize=10, fontweight="bold", color=color, pad=8)
        
    for j in range(num_samples, len(axes)):
        axes[j].axis("off")
        
    fig.suptitle(f"Sample {status_label} Test Predictions — VisionCore CNN", fontsize=14, fontweight="bold", y=0.98)
    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, bbox_inches="tight")
        print(f"[Visualization] Saved {status_label.lower()} predictions plot to: {save_path}")
    return fig


def plot_class_distribution(
    counts: Dict[str, int],
    save_path: Optional[Path] = None,
    title: str = "CIFAR-10 Class Distribution"
) -> plt.Figure:
    """Plot a bar chart showing the number of samples per class."""
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    classes = list(counts.keys())
    values = list(counts.values())
    
    palette = sns.color_palette("mako", len(classes))
    bars = ax.bar(classes, values, color=palette, edgecolor="black", alpha=0.85, width=0.6)
    
    for bar in bars:
        yval = bar.get_height()
        ax.text(
            bar.get_x() + bar.get_width() / 2.0,
            yval + max(values) * 0.01,
            f"{int(yval):,}",
            ha="center",
            va="bottom",
            fontsize=9,
            fontweight="bold"
        )
        
    ax.set_title(title, fontsize=14, fontweight="bold", pad=12)
    ax.set_xlabel("Class Name", fontsize=11, fontweight="bold")
    ax.set_ylabel("Number of Samples", fontsize=11, fontweight="bold")
    plt.xticks(rotation=30, ha="right", fontsize=10)
    ax.set_ylim(0, max(values) * 1.15)
    
    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, bbox_inches="tight")
        print(f"[Visualization] Saved class distribution to: {save_path}")
    return fig


def plot_model_comparison(
    comparison_df: pd.DataFrame,
    save_path: Optional[Path] = None
) -> plt.Figure:
    """Plot a comparison bar chart between Baseline ANN and VisionCore CNN."""
    fig, ax = plt.subplots(figsize=(9, 5), dpi=300)
    
    metrics = ["Train Accuracy (%)", "Val Accuracy (%)", "Test Accuracy (%)", "Macro F1 (%)"]
    x = np.arange(len(metrics))
    width = 0.35
    
    ann_vals = [
        comparison_df.loc[comparison_df["Model"] == "Baseline ANN", m].values[0] for m in metrics
    ]
    cnn_vals = [
        comparison_df.loc[comparison_df["Model"] == "VisionCore CNN", m].values[0] for m in metrics
    ]
    
    rects1 = ax.bar(x - width/2, ann_vals, width, label="Baseline ANN", color="#e74c3c", edgecolor="black", alpha=0.9)
    rects2 = ax.bar(x + width/2, cnn_vals, width, label="VisionCore CNN", color="#2ecc71", edgecolor="black", alpha=0.9)
    
    for rect in rects1:
        h = rect.get_height()
        ax.annotate(f"{h:.1f}%", xy=(rect.get_x() + rect.get_width() / 2, h),
                    xytext=(0, 3), textcoords="offset points", ha="center", va="bottom", fontsize=9, fontweight="bold")
        
    for rect in rects2:
        h = rect.get_height()
        ax.annotate(f"{h:.1f}%", xy=(rect.get_x() + rect.get_width() / 2, h),
                    xytext=(0, 3), textcoords="offset points", ha="center", va="bottom", fontsize=9, fontweight="bold")
        
    ax.set_title("Empirical Architecture Comparison: Baseline ANN vs. VisionCore CNN", fontsize=13, fontweight="bold", pad=12)
    ax.set_ylabel("Score (%)", fontsize=11, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels(metrics, fontsize=10, fontweight="bold")
    ax.set_ylim(0, 105)
    ax.legend(frameon=True, facecolor="white", shadow=True)
    
    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, bbox_inches="tight")
        print(f"[Visualization] Saved model comparison plot to: {save_path}")
    return fig


def save_checkpoint(
    model: nn.Module,
    optimizer: torch.optim.Optimizer,
    epoch: int,
    val_accuracy: float,
    train_accuracy: float,
    history: Dict[str, List[float]],
    filepath: Path,
    extra_config: Optional[Dict] = None
) -> None:
    """Save a comprehensive PyTorch model checkpoint."""
    checkpoint = {
        "epoch": epoch,
        "model_state_dict": model.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "val_accuracy": val_accuracy,
        "train_accuracy": train_accuracy,
        "history": history,
        "classes": config.CLASS_NAMES,
        "cifar_mean": config.CIFAR10_MEAN,
        "cifar_std": config.CIFAR10_STD,
        "extra_config": extra_config or {}
    }
    filepath.parent.mkdir(parents=True, exist_ok=True)
    torch.save(checkpoint, filepath)
    print(f"[Checkpoint] Model saved to {filepath} (Val Acc: {val_accuracy:.2f}%)")


def load_checkpoint(
    filepath: Path,
    model: nn.Module,
    optimizer: Optional[torch.optim.Optimizer] = None,
    device: torch.device = torch.device("cpu")
) -> Dict:
    """Load model and optimizer state dictionaries from a checkpoint file."""
    if not filepath.exists():
        raise FileNotFoundError(f"Checkpoint file not found at: {filepath}")
        
    checkpoint = torch.load(filepath, map_location=device)
    model.load_state_dict(checkpoint["model_state_dict"])
    if optimizer is not None and "optimizer_state_dict" in checkpoint:
        optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
        
    print(f"[Checkpoint] Successfully loaded checkpoint from {filepath} (Recorded Val Acc: {checkpoint.get('val_accuracy', 0.0):.2f}%)")
    return checkpoint


def save_metrics_json(metrics_dict: Dict, filepath: Path) -> None:
    """Save metrics dictionary to a formatted JSON file."""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(metrics_dict, f, indent=4)
    print(f"[Metrics] Saved metrics JSON to: {filepath}")


def save_text_report(report_str: str, filepath: Path) -> None:
    """Save raw string report to a text file."""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(report_str)
    print(f"[Metrics] Saved text report to: {filepath}")
