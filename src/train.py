import argparse
import sys
import time
from typing import Dict, List, Tuple

# Ensure UTF-8 output on Windows consoles
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from tqdm import tqdm

from src import config
from src.dataset import get_data_loaders
from src.model import get_model, count_parameters
from src.utils import (
    set_seed,
    save_checkpoint,
    plot_loss_curves,
    plot_accuracy_curves
)


def train_one_epoch(
    model: nn.Module,
    loader: DataLoader,
    criterion: nn.Module,
    optimizer: optim.Optimizer,
    device: torch.device,
    epoch: int,
    total_epochs: int,
    desc: str = "Training"
) -> Tuple[float, float]:
    """Execute a single training epoch across all mini-batches."""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    pbar = tqdm(loader, desc=f"Epoch [{epoch:02d}/{total_epochs:02d}] {desc}", leave=False)
    for images, labels in pbar:
        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

        current_loss = running_loss / total
        current_acc = (correct / total) * 100.0
        pbar.set_postfix(loss=f"{current_loss:.4f}", acc=f"{current_acc:.2f}%")

    epoch_loss = running_loss / total
    epoch_acc = (correct / total) * 100.0
    return epoch_loss, epoch_acc


def validate_one_epoch(
    model: nn.Module,
    loader: DataLoader,
    criterion: nn.Module,
    device: torch.device,
    desc: str = "Validation"
) -> Tuple[float, float]:
    """Evaluate model on the validation split with gradient tracking disabled."""
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():
        for images, labels in loader:
            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)
            loss = criterion(outputs, labels)

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

    val_loss = running_loss / total
    val_acc = (correct / total) * 100.0
    return val_loss, val_acc


def train_model(
    model_type: str = "cnn",
    epochs: int = config.CNN_EPOCHS,
    lr: float = config.CNN_LEARNING_RATE,
    weight_decay: float = config.CNN_WEIGHT_DECAY,
    batch_size: int = config.BATCH_SIZE,
    device: torch.device = config.DEVICE
) -> Tuple[nn.Module, Dict[str, List[float]]]:
    """Full training pipeline for either VisionCore CNN or Baseline ANN."""
    set_seed(config.RANDOM_SEED)

    print("=" * 70)
    print(f"🚀 Starting Training: {model_type.upper()} Model")
    print(f"   Epochs: {epochs} | LR: {lr} | Batch Size: {batch_size} | Device: {device}")
    print("=" * 70)

    train_loader, val_loader, _ = get_data_loaders(batch_size=batch_size)
    model = get_model(model_type).to(device)

    total_params, trainable_params = count_parameters(model)
    print(f"[{model_type.upper()}] Architecture Parameter Count: {total_params:,} (Trainable: {trainable_params:,})")

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr, weight_decay=weight_decay)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="max", factor=0.5, patience=3)

    history = {
        "train_loss": [],
        "train_acc": [],
        "val_loss": [],
        "val_acc": []
    }

    best_val_acc = 0.0
    save_path = config.CNN_MODEL_PATH if model_type == "cnn" else config.ANN_MODEL_PATH
    start_time = time.time()

    for epoch in range(1, epochs + 1):
        epoch_start = time.time()
        train_loss, train_acc = train_one_epoch(
            model, train_loader, criterion, optimizer, device, epoch, epochs, desc="Train"
        )
        val_loss, val_acc = validate_one_epoch(
            model, val_loader, criterion, device, desc="Val"
        )

        scheduler.step(val_acc)
        current_lr = optimizer.param_groups[0]["lr"]

        history["train_loss"].append(train_loss)
        history["train_acc"].append(train_acc)
        history["val_loss"].append(val_loss)
        history["val_acc"].append(val_acc)

        epoch_time = time.time() - epoch_start
        improved = val_acc > best_val_acc

        print(
            f"Epoch [{epoch:02d}/{epochs:02d}] ({epoch_time:.1f}s) | "
            f"Train Loss: {train_loss:.4f} - Acc: {train_acc:.2f}% | "
            f"Val Loss: {val_loss:.4f} - Acc: {val_acc:.2f}% | LR: {current_lr:.6f} "
            f"{'🌟 [BEST]' if improved else ''}"
        )

        if improved:
            best_val_acc = val_acc
            save_checkpoint(
                model=model,
                optimizer=optimizer,
                epoch=epoch,
                val_accuracy=val_acc,
                train_accuracy=train_acc,
                history=history,
                filepath=save_path,
                extra_config={
                    "model_type": model_type,
                    "batch_size": batch_size,
                    "lr": lr,
                    "weight_decay": weight_decay
                }
            )

    total_time = time.time() - start_time
    print("-" * 70)
    print(f"✅ Training Complete for {model_type.upper()} in {total_time/60:.2f} minutes!")
    print(f"   Peak Validation Accuracy: {best_val_acc:.2f}%")
    print(f"   Saved Checkpoint: {save_path}")
    print("-" * 70)

    # Save visual training curve plots for CNN
    if model_type == "cnn":
        plot_loss_curves(
            history["train_loss"],
            history["val_loss"],
            save_path=config.LOSS_CURVE_PATH,
            title="VisionCore CNN — Training vs Validation Loss"
        )
        plot_accuracy_curves(
            history["train_acc"],
            history["val_acc"],
            save_path=config.ACCURACY_CURVE_PATH,
            title="VisionCore CNN — Training vs Validation Accuracy"
        )

    return model, history


def main():
    parser = argparse.ArgumentParser(description="Train VisionCore CNN or Baseline ANN on CIFAR-10.")
    parser.add_argument(
        "--model",
        type=str,
        default="cnn",
        choices=["cnn", "ann", "all"],
        help="Choose model architecture to train ('cnn', 'ann', or 'all')."
    )
    parser.add_argument("--epochs", type=int, default=None, help="Override number of training epochs.")
    parser.add_argument("--batch-size", type=int, default=config.BATCH_SIZE, help="Batch size for training.")
    parser.add_argument("--lr", type=float, default=None, help="Learning rate.")
    args = parser.parse_args()

    if args.model in ["ann", "all"]:
        epochs = args.epochs or config.ANN_EPOCHS
        lr = args.lr or config.ANN_LEARNING_RATE
        train_model("ann", epochs=epochs, lr=lr, batch_size=args.batch_size)

    if args.model in ["cnn", "all"]:
        epochs = args.epochs or config.CNN_EPOCHS
        lr = args.lr or config.CNN_LEARNING_RATE
        train_model("cnn", epochs=epochs, lr=lr, batch_size=args.batch_size)


if __name__ == "__main__":
    main()
