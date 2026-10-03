import argparse
import sys
from pathlib import Path
from typing import Dict, List, Tuple

# Ensure UTF-8 output on Windows consoles
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score
)
from torch.utils.data import DataLoader

from src import config
from src.dataset import get_data_loaders
from src.model import get_model
from src.utils import (
    load_checkpoint,
    plot_confusion_matrix,
    plot_model_comparison,
    plot_sample_predictions,
    save_metrics_json,
    save_text_report,
    set_seed
)


def evaluate_model_on_test(
    model: nn.Module,
    test_loader: DataLoader,
    device: torch.device
) -> Tuple[List[int], List[int], List[float], List[torch.Tensor]]:
    """Run full inference on test_loader and collect predictions, ground truth, probabilities, and sample tensors."""
    model.eval()
    y_true: List[int] = []
    y_pred: List[int] = []
    confidences: List[float] = []
    raw_images: List[torch.Tensor] = []

    with torch.no_grad():
        for images, labels in test_loader:
            images_dev = images.to(device)
            logits = model(images_dev)
            probs = torch.softmax(logits, dim=1)
            batch_confs, batch_preds = torch.max(probs, dim=1)

            y_true.extend(labels.cpu().numpy().tolist())
            y_pred.extend(batch_preds.cpu().numpy().tolist())
            confidences.extend(batch_confs.cpu().numpy().tolist())
            
            # Keep first 50 image tensors for qualitative analysis
            if len(raw_images) < 50:
                for img in images.cpu():
                    if len(raw_images) < 50:
                        raw_images.append(img)

    return y_true, y_pred, confidences, raw_images


def compute_per_class_accuracy(
    y_true: List[int],
    y_pred: List[int],
    classes: List[str]
) -> pd.DataFrame:
    """Calculate individual accuracy score for each of the 10 classes."""
    y_t = np.array(y_true)
    y_p = np.array(y_pred)
    records = []

    for idx, class_name in enumerate(classes):
        class_mask = (y_t == idx)
        class_total = int(class_mask.sum())
        class_correct = int((y_p[class_mask] == idx).sum())
        acc = (class_correct / class_total) * 100.0 if class_total > 0 else 0.0
        records.append({
            "Class Index": idx,
            "Class Name": class_name,
            "Total Samples": class_total,
            "Correct Predictions": class_correct,
            "Accuracy (%)": round(acc, 2)
        })

    return pd.DataFrame(records)


def run_evaluation(
    cnn_checkpoint_path: Path = config.CNN_MODEL_PATH,
    ann_checkpoint_path: Path = config.ANN_MODEL_PATH,
    device: torch.device = config.DEVICE
) -> Dict:
    """Execute complete evaluation suite, save metrics and generate all plots."""
    set_seed(config.RANDOM_SEED)
    _, _, test_loader = get_data_loaders(batch_size=config.BATCH_SIZE)

    print("=" * 70)
    print("📊 Evaluating VisionCore CNN on Untouched CIFAR-10 Test Set (10,000 images)")
    print("=" * 70)

    # 1. Load CNN Model
    cnn_model = get_model("cnn").to(device)
    cnn_ckpt = load_checkpoint(cnn_checkpoint_path, cnn_model, device=device)

    y_true, y_pred, confidences, raw_images = evaluate_model_on_test(cnn_model, test_loader, device)

    # 2. Compute Global Metrics
    test_acc = accuracy_score(y_true, y_pred) * 100.0
    macro_precision = precision_score(y_true, y_pred, average="macro", zero_division=0) * 100.0
    weighted_precision = precision_score(y_true, y_pred, average="weighted", zero_division=0) * 100.0
    macro_recall = recall_score(y_true, y_pred, average="macro", zero_division=0) * 100.0
    weighted_recall = recall_score(y_true, y_pred, average="weighted", zero_division=0) * 100.0
    macro_f1 = f1_score(y_true, y_pred, average="macro", zero_division=0) * 100.0
    weighted_f1 = f1_score(y_true, y_pred, average="weighted", zero_division=0) * 100.0

    print(f"\n[Test Set Results — VisionCore CNN]")
    print(f"  • Overall Test Accuracy:    {test_acc:.2f}%")
    print(f"  • Macro Precision:          {macro_precision:.2f}%")
    print(f"  • Macro Recall:             {macro_recall:.2f}%")
    print(f"  • Macro F1-Score:           {macro_f1:.2f}%")
    print(f"  • Weighted F1-Score:        {weighted_f1:.2f}%")

    # 3. Scikit-Learn Classification Report
    cls_report = classification_report(
        y_true,
        y_pred,
        target_names=config.CLASS_NAMES,
        digits=4
    )
    print("\n[Detailed Classification Report]")
    print(cls_report)
    save_text_report(cls_report, config.CLASSIFICATION_REPORT_PATH)

    # 4. Per-Class Accuracy Table
    per_class_df = compute_per_class_accuracy(y_true, y_pred, config.CLASS_NAMES)
    print("\n[Per-Class Accuracy Breakdown]")
    print(per_class_df.to_string(index=False))

    # 5. Plot Confusion Matrices (Raw & Normalized)
    plot_confusion_matrix(
        y_true, y_pred, config.CLASS_NAMES,
        save_path=config.CONFUSION_MATRIX_PATH,
        normalize=False,
        title="VisionCore CNN — Confusion Matrix (CIFAR-10 Test Set)"
    )
    plot_confusion_matrix(
        y_true, y_pred, config.CLASS_NAMES,
        save_path=config.NORM_CONFUSION_MATRIX_PATH,
        normalize=True,
        title="VisionCore CNN — Normalized Confusion Matrix (%)"
    )

    # 6. Sample Correct vs Incorrect Predictions
    correct_indices = [i for i in range(len(raw_images)) if y_true[i] == y_pred[i]]
    incorrect_indices = [i for i in range(len(raw_images)) if y_true[i] != y_pred[i]]

    if correct_indices:
        plot_sample_predictions(
            [raw_images[i] for i in correct_indices],
            [y_true[i] for i in correct_indices],
            [y_pred[i] for i in correct_indices],
            [confidences[i] for i in correct_indices],
            config.CLASS_NAMES,
            save_path=config.CORRECT_PREDICTIONS_PATH,
            correct=True
        )

    if incorrect_indices:
        plot_sample_predictions(
            [raw_images[i] for i in incorrect_indices],
            [y_true[i] for i in incorrect_indices],
            [y_pred[i] for i in incorrect_indices],
            [confidences[i] for i in incorrect_indices],
            config.CLASS_NAMES,
            save_path=config.INCORRECT_PREDICTIONS_PATH,
            correct=False
        )

    # 7. Evaluate Baseline ANN if Checkpoint Exists
    ann_metrics = None
    if ann_checkpoint_path.exists():
        print("\n" + "=" * 70)
        print("📊 Evaluating Baseline ANN on CIFAR-10 Test Set for Empirical Comparison")
        print("=" * 70)
        ann_model = get_model("ann").to(device)
        ann_ckpt = load_checkpoint(ann_checkpoint_path, ann_model, device=device)
        ann_y_true, ann_y_pred, _, _ = evaluate_model_on_test(ann_model, test_loader, device)

        ann_test_acc = accuracy_score(ann_y_true, ann_y_pred) * 100.0
        ann_macro_f1 = f1_score(ann_y_true, ann_y_pred, average="macro", zero_division=0) * 100.0
        ann_val_acc = ann_ckpt.get("val_accuracy", 0.0)
        ann_train_acc = ann_ckpt.get("train_accuracy", 0.0)

        comparison_data = [
            {
                "Model": "Baseline ANN",
                "Architecture": "3-Layer MLP (Flatten -> Linear 1024 -> Linear 512 -> Linear 10)",
                "Train Accuracy (%)": round(ann_train_acc, 2),
                "Val Accuracy (%)": round(ann_val_acc, 2),
                "Test Accuracy (%)": round(ann_test_acc, 2),
                "Macro F1 (%)": round(ann_macro_f1, 2)
            },
            {
                "Model": "VisionCore CNN",
                "Architecture": "3-Stage ConvNet (Conv-BN-ReLU x2 + MaxPool + Dropout)",
                "Train Accuracy (%)": round(cnn_ckpt.get("train_accuracy", 0.0), 2),
                "Val Accuracy (%)": round(cnn_ckpt.get("val_accuracy", 0.0), 2),
                "Test Accuracy (%)": round(test_acc, 2),
                "Macro F1 (%)": round(macro_f1, 2)
            }
        ]

        comparison_df = pd.DataFrame(comparison_data)
        comparison_df.to_csv(config.MODEL_COMPARISON_CSV_PATH, index=False)
        plot_model_comparison(comparison_df, config.MODEL_COMPARISON_PLOT_PATH)
        print("\n[Architecture Comparison: ANN vs CNN]")
        print(comparison_df.to_string(index=False))

    # 8. Save Metrics JSON
    metrics_payload = {
        "model": "VisionCore CNN",
        "checkpoint": str(cnn_checkpoint_path),
        "test_samples": len(y_true),
        "test_accuracy": round(test_acc, 4),
        "macro_precision": round(macro_precision, 4),
        "weighted_precision": round(weighted_precision, 4),
        "macro_recall": round(macro_recall, 4),
        "weighted_recall": round(weighted_recall, 4),
        "macro_f1": round(macro_f1, 4),
        "weighted_f1": round(weighted_f1, 4),
        "per_class_accuracy": per_class_df.to_dict(orient="records"),
        "ann_comparison": comparison_data if ann_checkpoint_path.exists() else None
    }
    save_metrics_json(metrics_payload, config.METRICS_JSON_PATH)

    print("\n✅ All evaluation metrics, reports, and plots saved successfully!")
    return metrics_payload


def main():
    parser = argparse.ArgumentParser(description="Evaluate VisionCore models on CIFAR-10 test set.")
    parser.add_argument("--cnn-path", type=str, default=str(config.CNN_MODEL_PATH))
    parser.add_argument("--ann-path", type=str, default=str(config.ANN_MODEL_PATH))
    args = parser.parse_args()

    run_evaluation(
        cnn_checkpoint_path=Path(args.cnn_path),
        ann_checkpoint_path=Path(args.ann_path)
    )


if __name__ == "__main__":
    main()
