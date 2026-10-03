"""PyTorch Neural Network Architectures: Baseline ANN and VisionCore CNN for CIFAR-10."""

from typing import Tuple
import torch
import torch.nn as nn
import torch.nn.functional as F

from src import config


class BaselineANN(nn.Module):
    """Fully-Connected Artificial Neural Network (Baseline Model).
    
    This architecture flattens the 32x32x3 image tensor into a 1D vector of 3,072 features
    and passes it through fully-connected (dense) layers with ReLU activations and Dropout.
    
    Purpose:
    - Demonstrates empirical limitations of fully connected architectures on visual data
      where 2D spatial relationships and locality are destroyed by initial flattening.
    """

    def __init__(self, num_classes: int = config.NUM_CLASSES):
        super().__init__()
        self.flatten = nn.Flatten()
        self.network = nn.Sequential(
            # Input: 32 * 32 * 3 = 3072 features
            nn.Linear(3072, 1024),
            nn.BatchNorm1d(1024),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.2),

            nn.Linear(1024, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.2),

            nn.Linear(512, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (B, 3, 32, 32)
        x = self.flatten(x)  # (B, 3072)
        logits = self.network(x)  # (B, 10)
        return logits


class VisionCoreCNN(nn.Module):
    """VisionCore Convolutional Neural Network for CIFAR-10 Classification.
    
    Architecture Highlights:
    1. Hierarchical Feature Extraction:
       - Block 1 (3 -> 32 channels): Captures low-level edges, corners, and color gradients.
       - Block 2 (32 -> 64 channels): Captures mid-level textures, curves, and localized shapes.
       - Block 3 (64 -> 128 channels): Captures high-level semantic object parts (wheels, ears, wings).
    2. Batch Normalization:
       - Stabilizes activation distributions between conv layers, enabling faster learning rates.
    3. Max Pooling (2x2):
       - Provides spatial downsampling and translation invariance while reducing parameter burden.
    4. Dropout Regularization:
       - 0.25 after pooling layers, 0.50 before final classifier to prevent co-adaptation and overfitting.
    """

    def __init__(self, num_classes: int = config.NUM_CLASSES):
        super().__init__()

        # Conv Block 1: Input (3, 32, 32) -> Output (32, 16, 16)
        self.conv_block1 = nn.Sequential(
            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),  # 32x32 -> 16x16
            nn.Dropout2d(p=0.25)
        )

        # Conv Block 2: Input (32, 16, 16) -> Output (64, 8, 8)
        self.conv_block2 = nn.Sequential(
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),  # 16x16 -> 8x8
            nn.Dropout2d(p=0.25)
        )

        # Conv Block 3: Input (64, 8, 8) -> Output (128, 4, 4)
        self.conv_block3 = nn.Sequential(
            nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),  # 8x8 -> 4x4
            nn.Dropout2d(p=0.25)
        )

        # Dense Classifier: Input (128 * 4 * 4 = 2048) -> Output (10 logits)
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 4 * 4, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.5),
            nn.Linear(512, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.conv_block1(x)
        x = self.conv_block2(x)
        x = self.conv_block3(x)
        logits = self.classifier(x)
        return logits


def count_parameters(model: nn.Module) -> Tuple[int, int]:
    """Return total parameters and trainable parameters count."""
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    return total, trainable


def get_model(model_type: str = "cnn", num_classes: int = config.NUM_CLASSES) -> nn.Module:
    """Factory function to instantiate models."""
    model_type = model_type.lower().strip()
    if model_type == "cnn":
        return VisionCoreCNN(num_classes=num_classes)
    elif model_type in ["ann", "baseline", "mlp"]:
        return BaselineANN(num_classes=num_classes)
    else:
        raise ValueError(f"Unknown model type: '{model_type}'. Choose 'cnn' or 'ann'.")
