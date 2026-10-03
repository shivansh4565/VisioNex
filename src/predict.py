"""Inference and Prediction Engine for VisionCore CIFAR-10 Classification."""

from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union
import io
import torch
from PIL import Image
import torchvision.transforms as transforms

from src import config
from src.model import VisionCoreCNN
from src.utils import get_class_emoji, load_checkpoint


class VisionCorePredictor:
    """Production-grade inference wrapper for the VisionCore CIFAR-10 CNN model."""

    def __init__(
        self,
        model_path: Union[str, Path] = config.CNN_MODEL_PATH,
        device: Optional[torch.device] = None
    ):
        self.model_path = Path(model_path)
        self.device = device or config.get_device()
        self.model: Optional[VisionCoreCNN] = None
        self.transform = transforms.Compose([
            transforms.Resize(config.IMAGE_SIZE),
            transforms.ToTensor(),
            transforms.Normalize(mean=config.CIFAR10_MEAN, std=config.CIFAR10_STD)
        ])
        self._load_model()

    def _load_model(self) -> None:
        """Instantiate and load the weights into the CNN architecture."""
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Trained model checkpoint not found at '{self.model_path}'. "
                f"Please train the model first by running `python run.py --mode train`."
            )

        self.model = VisionCoreCNN(num_classes=config.NUM_CLASSES).to(self.device)
        load_checkpoint(self.model_path, self.model, device=self.device)
        self.model.eval()

    def preprocess_image(self, image_input: Union[str, Path, bytes, Image.Image, io.BytesIO]) -> Tuple[torch.Tensor, Image.Image]:
        """Load, validate, convert to RGB, resize, and normalize an input image.
        
        Returns:
            Tuple containing:
              - Normalized 4D Tensor (1, 3, 32, 32)
              - Original PIL Image in RGB format
        """
        try:
            if isinstance(image_input, (str, Path)):
                img_path = Path(image_input)
                if not img_path.exists():
                    raise FileNotFoundError(f"Image file does not exist at: {img_path}")
                pil_img = Image.open(img_path)
            elif isinstance(image_input, bytes):
                pil_img = Image.open(io.BytesIO(image_input))
            elif isinstance(image_input, io.BytesIO):
                pil_img = Image.open(image_input)
            elif isinstance(image_input, Image.Image):
                pil_img = image_input
            else:
                raise TypeError(f"Unsupported image input type: {type(image_input)}")

            # Convert any format (RGBA, Grayscale, CMYK) to standard 3-channel RGB
            pil_img_rgb = pil_img.convert("RGB")
            
            # Apply transformation pipeline: Resize -> ToTensor -> Normalize
            tensor = self.transform(pil_img_rgb).unsqueeze(0)  # Shape: (1, 3, 32, 32)
            return tensor, pil_img_rgb

        except Exception as e:
            raise ValueError(f"Failed to process image: {str(e)}") from e

    def predict(
        self,
        image_input: Union[str, Path, bytes, Image.Image, io.BytesIO],
        top_k: int = 3
    ) -> Dict[str, Any]:
        """Perform end-to-end prediction on a single image.
        
        Returns a rich payload containing:
          - predicted_class: Class label string
          - class_index: Integer index (0-9)
          - emoji: Visual emoji representation
          - confidence: Confidence probability (0.0 to 1.0)
          - confidence_percentage: String formatted (e.g. '87.4%')
          - top_predictions: Ranked list of top-K classes with confidences
          - all_probabilities: Full 10-class probability distribution
        """
        if self.model is None:
            self._load_model()

        tensor, pil_img = self.preprocess_image(image_input)
        tensor = tensor.to(self.device)

        with torch.no_grad():
            logits = self.model(tensor)  # Raw unnormalized outputs
            probabilities = torch.softmax(logits, dim=1).squeeze(0)  # (10,)

        # Extract primary prediction via argmax
        pred_idx = torch.argmax(probabilities).item()
        pred_class = config.CLASS_NAMES[pred_idx]
        confidence = probabilities[pred_idx].item()

        # Extract top-k predictions
        top_k_val = min(top_k, len(config.CLASS_NAMES))
        top_probs, top_indices = torch.topk(probabilities, k=top_k_val)
        
        top_predictions: List[Dict[str, Any]] = []
        for prob, idx in zip(top_probs.tolist(), top_indices.tolist()):
            cls_name = config.CLASS_NAMES[idx]
            top_predictions.append({
                "rank": len(top_predictions) + 1,
                "class": cls_name,
                "emoji": get_class_emoji(cls_name),
                "confidence": prob,
                "percentage": f"{prob * 100:.2f}%",
                "index": idx
            })

        # Build full distribution dictionary
        all_probs = {
            cls_name: float(probabilities[i].item())
            for i, cls_name in enumerate(config.CLASS_NAMES)
        }

        return {
            "predicted_class": pred_class,
            "class_index": pred_idx,
            "emoji": get_class_emoji(pred_class),
            "confidence": confidence,
            "confidence_percentage": f"{confidence * 100:.2f}%",
            "top_predictions": top_predictions,
            "all_probabilities": all_probs,
            "image_size": pil_img.size
        }


def predict_image(
    image_input: Union[str, Path, bytes, Image.Image, io.BytesIO],
    model_path: Union[str, Path] = config.CNN_MODEL_PATH
) -> Dict[str, Any]:
    """Convenience functional API for single image prediction."""
    predictor = VisionCorePredictor(model_path=model_path)
    return predictor.predict(image_input)
