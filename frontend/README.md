# VisioNex Frontend — Modern Computer Vision Web Application

Intelligent, production-quality user interface for the **VisioNex PyTorch CIFAR-10 Image Classification Platform**.

Built with **Vite, React 18, Tailwind CSS, Lucide React, Framer Motion, Recharts, and React Router**.

---

## 🌟 Key Features

* **⚡ Fast & Modern SPA:** Built on Vite and React 18 for sub-second hot reloading and instant bundle generation.
* **🧠 Real-Time CNN Inference:** Drag & drop image upload area with dual preprocessing preview (Original vs. $32 \times 32$ tensor).
* **🏆 Confidence Breakdown & Top-3:** Visual progress bars, prominent predicted class badge with emojis, and softmax probability distributions.
* **📊 10-Class Recharts Analytics:** Responsive horizontal bar chart displaying full categorical probability spectrum.
* **🔲 Interactive Confusion Matrix:** 10×10 empirical confusion matrix heatmap with hover cell inspector and per-class precision/recall tables.
* **🔬 Interactive Layer Visualizer:** Step-by-step interactive diagram of the 3-stage PyTorch CNN architecture.
* **📜 Prediction History:** Stored in `localStorage` with thumbnail previews, filenames, predictions, confidence, and timestamps.
* **🌓 Dark & Light Modes:** Persistent theme toggle with custom dark navy palette.
* **📱 Fully Responsive:** Mobile-first drawer navigation, touch-friendly upload box, and adaptive chart scaling.
* **🔌 Dual Mode (Live API & High-Fidelity Mock):** Auto-connects to the FastAPI PyTorch backend (`POST /predict`) or falls back gracefully to realistic simulated inference when running standalone.

---

## 🏗️ Component & Directory Structure

```text
frontend/src/
├── components/
│   ├── ArchitectureDiagram.jsx  # Interactive CNN layer visualizer
│   ├── ConfidenceBar.jsx        # Animated rank/confidence progress bar
│   ├── ConfusionMatrix.jsx      # 10x10 interactive test set confusion matrix
│   ├── DashboardLayout.jsx      # Dashboard wrapper with responsive sidebar
│   ├── FeatureCard.jsx          # Feature cards with hover micro-animations
│   ├── Footer.jsx               # Site-wide footer with resources & docs
│   ├── GithubIcon.jsx           # Clean SVG GitHub brand icon
│   ├── Hero.jsx                 # Dark navy hero with animated pipeline
│   ├── ImagePreview.jsx         # Dual preview (Original vs 32x32 CNN tensor)
│   ├── Navbar.jsx               # Sticky responsive navbar with theme toggle
│   ├── PredictionCard.jsx       # Large prediction output card with Top-3
│   ├── PredictionHistory.jsx    # LocalStorage recent prediction table
│   ├── ProbabilityChart.jsx     # Recharts 10-class horizontal bar chart
│   ├── RootLayout.jsx           # Public pages layout wrapper
│   ├── Sidebar.jsx              # Dashboard navigation sidebar & status
│   ├── StatsCard.jsx            # 4 Key CIFAR-10 benchmark metrics
│   ├── ThemeToggle.jsx          # Sun/Moon dark mode toggle button
│   └── UploadBox.jsx            # Drag & drop upload + 1-click sample picker
│
├── data/
│   └── classes.js               # CIFAR-10 metadata, colors, confusion data
│
├── hooks/
│   └── usePrediction.js         # State management, history, and validation hook
│
├── pages/
│   ├── About.jsx                # Project motivation & separated tech stack
│   ├── Classifier.jsx           # Primary CNN image classification workspace
│   ├── Dashboard.jsx            # Dashboard overview with status & quick actions
│   ├── Home.jsx                 # Landing page
│   ├── HowItWorks.jsx           # Educational 7-step CNN mechanics walkthrough
│   └── NotFound.jsx             # Custom 404 page
│
├── services/
│   └── api.js                   # Backend API client with automatic mock fallback
│
├── App.jsx                      # React Router route definitions
├── index.css                    # Tailwind directives & custom CSS
└── main.jsx                     # Application bootstrap
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file (or copy `.env.example`):
```env
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## 🔌 Connecting with PyTorch Backend

1. Start the PyTorch FastAPI backend server:
```bash
# In project root:
python run.py --mode api
# or:
uvicorn app.api_server:app --port 8000
```

2. Start the Frontend:
```bash
# In project root:
python run.py --mode frontend
# or in frontend directory:
npm run dev
```

3. When an image is uploaded, the frontend transmits `multipart/form-data` to `http://localhost:8000/predict`, which passes the image directly through `models/best_cifar10_cnn.pth` and returns exact PyTorch logits and softmax probabilities.
