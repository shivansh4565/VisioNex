"""CIFAR-10 Dataset loading, transformations, 80/20 train-val splitting, and DataLoader utilities."""

from typing import Dict, List, Tuple
import torch
from torch.utils.data import DataLoader, Dataset, Subset, random_split
import torchvision
import torchvision.transforms as transforms
from PIL import Image

from src import config
from src.utils import set_seed


class TransformSubset(Dataset):
    """Custom wrapper on a dataset subset that applies a specific transform.
    
    This ensures that when the official training set is split into Train (80%) and
    Validation (20%), the training split receives data augmentation while the validation
    split uses only deterministic normalization without random transformations.
    """

    def __init__(self, subset: Subset, transform: transforms.Compose):
        self.subset = subset
        self.transform = transform

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int]:
        x, y = self.subset.dataset[self.subset.indices[idx]]
        # If x is PIL image or tensor
        if not isinstance(x, Image.Image) and isinstance(x, torch.Tensor):
            x = transforms.ToPILImage()(x)
        if self.transform is not None:
            x = self.transform(x)
        return x, y

    def __len__(self) -> int:
        return len(self.subset.indices)


def get_transforms() -> Tuple[transforms.Compose, transforms.Compose]:
    """Build and return data transformation pipelines for training and validation/testing.
    
    Why Image Normalization is Crucial:
    - Normalizing pixel values with CIFAR-10 channel mean and standard deviation centers
      the input distribution around zero with unit variance.
    - This prevents exploding/vanishing gradients, stabilizes backpropagation dynamics,
      and accelerates gradient descent convergence across all convolutional layers.
      
    Why Data Augmentation is Applied to Training:
    - Random crops and horizontal flips synthetically expand the dataset diversity,
      preventing the CNN from overfitting to exact pixel locations and orientations.
    """
    train_transform = transforms.Compose([
        transforms.RandomCrop(32, padding=4, padding_mode="reflect"),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.ToTensor(),
        transforms.Normalize(mean=config.CIFAR10_MEAN, std=config.CIFAR10_STD)
    ])

    test_transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=config.CIFAR10_MEAN, std=config.CIFAR10_STD)
    ])

    return train_transform, test_transform


def get_cifar10_datasets(
    data_dir: str = str(config.DATA_DIR),
    val_split_ratio: float = config.TRAIN_VAL_SPLIT_RATIO,
    seed: int = config.RANDOM_SEED
) -> Tuple[Dataset, Dataset, Dataset]:
    """Download CIFAR-10 (if not already cached) and create Train (80%), Val (20%), and Test sets.
    
    The official 50,000 training images are split into 40,000 for training and 10,000 for validation.
    The official 10,000 test set remains completely untouched.
    """
    set_seed(seed)
    train_transform, test_transform = get_transforms()

    # Base dataset without transforms to apply them selectively after splitting
    base_train_val = torchvision.datasets.CIFAR10(
        root=data_dir,
        train=True,
        download=True,
        transform=None
    )

    test_dataset = torchvision.datasets.CIFAR10(
        root=data_dir,
        train=False,
        download=True,
        transform=test_transform
    )

    # 80/20 Train/Validation reproducible split
    total_train = len(base_train_val)
    train_size = int(val_split_ratio * total_train)
    val_size = total_train - train_size

    generator = torch.Generator().manual_seed(seed)
    train_subset, val_subset = random_split(
        base_train_val, [train_size, val_size], generator=generator
    )

    # Wrap subsets with distinct transforms
    train_dataset = TransformSubset(train_subset, transform=train_transform)
    val_dataset = TransformSubset(val_subset, transform=test_transform)

    print(f"[Dataset] CIFAR-10 Ready:")
    print(f"  - Training Set:   {len(train_dataset):,} samples ({val_split_ratio*100:.0f}%)")
    print(f"  - Validation Set: {len(val_dataset):,} samples ({(1-val_split_ratio)*100:.0f}%)")
    print(f"  - Test Set:       {len(test_dataset):,} samples (Untouched benchmark)")

    return train_dataset, val_dataset, test_dataset


def get_data_loaders(
    batch_size: int = config.BATCH_SIZE,
    num_workers: int = config.NUM_WORKERS,
    data_dir: str = str(config.DATA_DIR),
    seed: int = config.RANDOM_SEED
) -> Tuple[DataLoader, DataLoader, DataLoader]:
    """Create and return PyTorch DataLoaders for train, validation, and test datasets."""
    train_dataset, val_dataset, test_dataset = get_cifar10_datasets(
        data_dir=data_dir,
        val_split_ratio=config.TRAIN_VAL_SPLIT_RATIO,
        seed=seed
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=torch.cuda.is_available()
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=torch.cuda.is_available()
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=torch.cuda.is_available()
    )

    return train_loader, val_loader, test_loader


def get_dataset_class_counts(dataset: Dataset) -> Dict[str, int]:
    """Calculate class frequency distribution for a given dataset or subset."""
    counts = {name: 0 for name in config.CLASS_NAMES}
    if isinstance(dataset, TransformSubset):
        targets = [dataset.subset.dataset.targets[i] for i in dataset.subset.indices]
    elif hasattr(dataset, "targets"):
        targets = dataset.targets
    else:
        targets = [y for _, y in dataset]

    for label in targets:
        counts[config.CLASS_NAMES[label]] += 1
    return counts
