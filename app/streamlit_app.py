"""VisionCore — CIFAR-10 Image Classification Streamlit Web Application.

A modern, portfolio-quality UI for real-time inference, model exploration,
training diagnostics, and empirical ANN vs. CNN comparison.
"""

import os
import sys
from pathlib import Path
from typing import Dict, List, Optional
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import streamlit as st
import torch
import torchvision
from PIL import Image

# Ensure project root is in Python path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src import config
from src.predict import VisionCorePredictor
from src.utils import get_class_emoji, get_class_names

# ==========================================
# Page Configuration & Styling
# ==========================================
st.set_page_config(
    page_title="VisionCore — CIFAR-10 Classifier",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for modern glassmorphism & typography
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(135deg, #1E88E5 0%, #7E57C2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #546E7A;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background: rgba(30, 136, 229, 0.08);
        border: 1px solid rgba(30, 136, 229, 0.2);
        border-radius: 12px;
        padding: 16px;
        text-align: center;
    }
    .pred-badge {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1E88E5;
    }
    .confidence-badge {
        font-size: 1.2rem;
        font-weight: 600;
        color: #2E7D32;
    }
    .limitation-box {
        background-color: #FFF8E1;
        border-left: 5px solid #FFB300;
        padding: 12px 16px;
        border-radius: 6px;
        margin: 15px 0;
        font-size: 0.92rem;
        color: #5D4037;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        padding: 10px 20px;
        font-weight: 600;
        border-radius: 8px;
    }
</style>
""", unsafe_allow_html=True)


@st.cache_resource
def load_cached_predictor() -> Optional[VisionCorePredictor]:
    """Load and cache the trained VisionCore CNN predictor."""
    if not config.CNN_MODEL_PATH.exists():
        return None
    try:
        predictor = VisionCorePredictor(model_path=config.CNN_MODEL_PATH)
        return predictor
    except Exception as e:
        st.error(f"Error loading model checkpoint: {str(e)}")
        return None


@st.cache_data
def get_sample_cifar10_images() -> Dict[str, Image.Image]:
    """Provide pre-loaded sample CIFAR-10 images for instant one-click testing."""
    samples = {}
    try:
        testset = torchvision.datasets.CIFAR10(
            root=str(config.DATA_DIR),
            train=False,
            download=True,
            transform=None
        )
        found_classes = set()
        for img, label in testset:
            class_name = config.CLASS_NAMES[label]
            if class_name not in found_classes:
                samples[f"{get_class_emoji(class_name)} {class_name.capitalize()}"] = img
                found_classes.add(class_name)
            if len(found_classes) == 10:
                break
    except Exception:
        pass
    return samples


def render_probability_chart(probabilities: Dict[str, float], predicted_class: str):
    """Render a clean horizontal bar chart for all 10 CIFAR-10 class probabilities."""
    classes = list(probabilities.keys())
    probs = [probabilities[c] * 100 for c in classes]
    
    # Sort from highest to lowest probability
    sorted_indices = np.argsort(probs)
    sorted_classes = [f"{get_class_emoji(classes[i])} {classes[i].capitalize()}" for i in sorted_indices]
    sorted_probs = [probs[i] for i in sorted_indices]

    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=200)
    
    colors = [
        "#1E88E5" if classes[i] == predicted_class else "#90CAF9"
        for i in sorted_indices
    ]
    
    bars = ax.barh(sorted_classes, sorted_probs, color=colors, edgecolor="#1565C0", alpha=0.9, height=0.65)
    
    for bar in bars:
        w = bar.get_width()
        ax.text(
            w + 1.0,
            bar.get_y() + bar.get_height() / 2.0,
            f"{w:.1f}%",
            ha="left",
            va="center",
            fontsize=8.5,
            fontweight="bold",
            color="#263238"
        )
        
    ax.set_xlim(0, 115)
    ax.set_xlabel("Confidence Probability (%)", fontsize=10, fontweight="bold")
    ax.set_title("Probability Distribution Across All 10 Classes", fontsize=11, fontweight="bold", pad=10)
    ax.grid(axis="x", linestyle=":", alpha=0.6)
    sns.despine(top=True, right=True)
    plt.tight_layout()
    st.pyplot(fig)


# ==========================================
# Sidebar UI
# ==========================================
with st.sidebar:
    st.image("https://raw.githubusercontent.com/pytorch/pytorch/master/docs/source/_static/img/pytorch-logo-dark.svg", width=180)
    st.markdown("### 🧠 VisionCore System Info")
    st.markdown(f"**Hardware Device:** `{config.DEVICE.type.upper()}`")
    st.markdown(f"**Framework:** `PyTorch {torch.__version__}`")
    st.markdown(f"**Input Dimension:** `3 × 32 × 32 (RGB)`")
    st.markdown(f"**Total Classes:** `10 categories`")

    st.markdown("---")
    st.markdown("### 📂 CIFAR-10 Categories")
    for name in config.CLASS_NAMES:
        st.markdown(f"- {get_class_emoji(name)} **{name.capitalize()}**")

    st.markdown("---")
    st.markdown("""
    <div class="limitation-box">
        <strong>⚠️ Domain Limitation:</strong><br>
        VisionCore is trained on 32×32 pixel images. Uploaded high-resolution photos will be downscaled, which may cause artifacts on out-of-domain images.
    </div>
    """, unsafe_allow_html=True)


# ==========================================
# Main Dashboard UI
# ==========================================
st.markdown('<div class="main-header">VisionCore: CIFAR-10 Image Classifier</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">A PyTorch-Powered Deep Convolutional Neural Network System for Real-Time Image Classification</div>', unsafe_allow_html=True)

# Tabs
tab_inference, tab_curves, tab_confusion, tab_comparison, tab_analysis = st.tabs([
    "🎯 Live Inference",
    "📈 Training Curves",
    "🔲 Confusion Matrix",
    "⚖️ ANN vs. CNN Comparison",
    "🔍 Error Analysis"
])

predictor = load_cached_predictor()

# ----------------------------------------------------
# TAB 1: Live Inference
# ----------------------------------------------------
with tab_inference:
    if predictor is None:
        st.warning("⚠️ Trained model checkpoint not found at `models/best_cifar10_cnn.pth`.")
        st.info("💡 Run the training command in your terminal to train and evaluate VisionCore:\n```bash\npython run.py --mode full\n```")
    else:
        st.markdown("#### Choose Input Method")
        input_choice = st.radio("Select Image Source:", ["Upload My Own Image", "Select a Preloaded CIFAR-10 Sample"], horizontal=True)

        selected_image: Optional[Image.Image] = None

        if input_choice == "Upload My Own Image":
            uploaded_file = st.file_uploader(
                "Upload an image (JPG, PNG, JPEG, WEBP)",
                type=["jpg", "jpeg", "png", "webp"]
            )
            if uploaded_file is not None:
                try:
                    selected_image = Image.open(uploaded_file)
                except Exception as e:
                    st.error(f"Could not load image: {str(e)}")
        else:
            sample_dict = get_sample_cifar10_images()
            if sample_dict:
                chosen_sample_name = st.selectbox("Select a benchmark sample from CIFAR-10 test set:", list(sample_dict.keys()))
                selected_image = sample_dict[chosen_sample_name]
            else:
                st.info("Dataset samples will be available once the dataset is downloaded.")

        if selected_image is not None:
            st.markdown("---")
            col_img, col_pred = st.columns([1, 1.4], gap="large")

            with col_img:
                st.markdown("##### 🖼️ Input Images")
                col_orig, col_32 = st.columns(2)
                with col_orig:
                    st.image(selected_image, caption="Original Image", use_container_width=True)
                with col_32:
                    downscaled_img = selected_image.resize((32, 32), Image.Resampling.BILINEAR)
                    st.image(downscaled_img, caption="32×32 CNN Input", use_container_width=True)

                st.caption(f"Original Resolution: {selected_image.size[0]}×{selected_image.size[1]} px | Scaled: 32×32 px")

            with col_pred:
                st.markdown("##### 🎯 Classification Output")
                try:
                    results = predictor.predict(selected_image, top_k=3)

                    # Top Prediction Metric Box
                    st.markdown(f"""
                    <div class="metric-card">
                        <div style="font-size: 0.9rem; color: #546E7A; font-weight: 600; text-transform: uppercase;">Top Predicted Class</div>
                        <div class="pred-badge">{results['emoji']} {results['predicted_class'].upper()}</div>
                        <div class="confidence-badge">Confidence: {results['confidence_percentage']}</div>
                    </div>
                    """, unsafe_allow_html=True)

                    st.markdown("<br>", unsafe_allow_html=True)
                    st.markdown("##### 🏆 Top-3 Predictions")
                    for top in results["top_predictions"]:
                        col_t1, col_t2 = st.columns([1, 3])
                        with col_t1:
                            st.write(f"**#{top['rank']} {top['emoji']} {top['class'].capitalize()}**")
                        with col_t2:
                            st.progress(float(top["confidence"]), text=top["percentage"])

                except Exception as e:
                    st.error(f"Inference error: {str(e)}")

            st.markdown("---")
            st.markdown("##### 📊 10-Class Probability Spectrum")
            if "results" in locals():
                render_probability_chart(results["all_probabilities"], results["predicted_class"])

# ----------------------------------------------------
# TAB 2: Training Curves
# ----------------------------------------------------
with tab_curves:
    st.markdown("### 📈 Training & Validation Convergence")
    col1, col2 = st.columns(2)
    with col1:
        if config.LOSS_CURVE_PATH.exists():
            st.image(str(config.LOSS_CURVE_PATH), caption="CrossEntropy Loss Curve across Epochs", use_container_width=True)
        else:
            st.info("Loss curve plot will appear here after running `python run.py --mode train`.")
    with col2:
        if config.ACCURACY_CURVE_PATH.exists():
            st.image(str(config.ACCURACY_CURVE_PATH), caption="Accuracy (%) Curve across Epochs", use_container_width=True)
        else:
            st.info("Accuracy curve plot will appear here after running `python run.py --mode train`.")

# ----------------------------------------------------
# TAB 3: Confusion Matrix
# ----------------------------------------------------
with tab_confusion:
    st.markdown("### 🔲 Confusion Matrix on 10,000 CIFAR-10 Test Samples")
    col1, col2 = st.columns(2)
    with col1:
        if config.CONFUSION_MATRIX_PATH.exists():
            st.image(str(config.CONFUSION_MATRIX_PATH), caption="Raw Count Confusion Matrix", use_container_width=True)
        else:
            st.info("Confusion matrix will appear here after running `python run.py --mode eval`.")
    with col2:
        if config.NORM_CONFUSION_MATRIX_PATH.exists():
            st.image(str(config.NORM_CONFUSION_MATRIX_PATH), caption="Normalized Confusion Matrix (Recall per Class)", use_container_width=True)
        else:
            st.info("Normalized confusion matrix will appear here after running `python run.py --mode eval`.")

# ----------------------------------------------------
# TAB 4: ANN vs CNN Comparison
# ----------------------------------------------------
with tab_comparison:
    st.markdown("### ⚖️ Empirical Architecture Comparison: Baseline ANN vs. VisionCore CNN")
    st.markdown("""
    **Why CNNs Outperform Fully Connected Networks on Images:**
    - **Spatial Locality:** Conv filters process 2D neighborhoods, preserving spatial relationships that 1D flattening destroys.
    - **Weight Sharing:** Convolutional kernels are shared across spatial locations, drastically reducing parameter count and preventing catastrophic overfitting.
    - **Translation Invariance:** Pooling and convolutional feature maps detect patterns (edges, ears, wheels) regardless of their exact pixel coordinates.
    """)

    if config.MODEL_COMPARISON_CSV_PATH.exists():
        comp_df = pd.read_csv(config.MODEL_COMPARISON_CSV_PATH)
        st.dataframe(comp_df, use_container_width=True)
    if config.MODEL_COMPARISON_PLOT_PATH.exists():
        st.image(str(config.MODEL_COMPARISON_PLOT_PATH), caption="Empirical Comparison Metrics", use_container_width=True)
    elif not config.MODEL_COMPARISON_CSV_PATH.exists():
        st.info("Comparison table and plot will be generated after executing `python run.py --mode full`.")

# ----------------------------------------------------
# TAB 5: Error Analysis
# ----------------------------------------------------
with tab_analysis:
    st.markdown("### 🔍 Model Diagnostic & Error Analysis")
    col1, col2 = st.columns(2)
    with col1:
        if config.CORRECT_PREDICTIONS_PATH.exists():
            st.image(str(config.CORRECT_PREDICTIONS_PATH), caption="Sample Correct Predictions with Confidence", use_container_width=True)
        else:
            st.info("Correct predictions sample grid will appear here after evaluation.")
    with col2:
        if config.INCORRECT_PREDICTIONS_PATH.exists():
            st.image(str(config.INCORRECT_PREDICTIONS_PATH), caption="Sample Misclassifications with Confidence", use_container_width=True)
        else:
            st.info("Misclassifications sample grid will appear here after evaluation.")
            
    if config.CLASSIFICATION_REPORT_PATH.exists():
        st.markdown("#### 📋 Official Test Set Classification Report")
        with open(config.CLASSIFICATION_REPORT_PATH, "r") as f:
            st.code(f.read(), language="text")
