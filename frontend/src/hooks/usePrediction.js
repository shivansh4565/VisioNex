import { useState, useEffect, useCallback } from "react";
import { predictImageAPI } from "../services/api";

const HISTORY_STORAGE_KEY = "visionex_prediction_history";

export function usePrediction() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  // Save history to localStorage
  const saveHistoryItem = useCallback((item) => {
    setHistory((prev) => {
      const updated = [item, ...prev.slice(0, 19)]; // Keep latest 20 items
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save history", e);
      }
      return updated;
    });
  }, []);

  const handleSelectFile = useCallback((file) => {
    if (!file) return;

    // Validate type resiliently by MIME or extension
    const name = (file.name || "").toLowerCase();
    const isImageExt = name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".webp") || name.endsWith(".bmp");
    const isImageMime = file.type && file.type.startsWith("image/");

    if (!isImageExt && !isImageMime && file.type) {
      setError("Please upload an image file (PNG, JPG, JPEG, or WEBP).");
      return;
    }

    // Validate size (e.g. max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError("Image size exceeds 15MB limit. Please upload a smaller image.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setPredictionResult(null);
  }, []);

  const clearSelection = useCallback(() => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPredictionResult(null);
    setError(null);
  }, [previewUrl]);

  const classify = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select or drop an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await predictImageAPI(selectedFile);
      setPredictionResult(result);

      // Create a small data-URI thumbnail for history
      const historyItem = {
        id: Date.now().toString(),
        filename: selectedFile.name || "cifar10_sample.jpg",
        predicted_class: result.predicted_class,
        displayName: result.displayName,
        emoji: result.emoji,
        confidence: result.confidence,
        confidence_percentage: result.confidence_percentage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        preview: previewUrl
      };

      saveHistoryItem(historyItem);
    } catch (err) {
      setError(err.message || "Failed to classify image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, previewUrl, saveHistoryItem]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  }, []);

  return {
    selectedFile,
    previewUrl,
    isLoading,
    error,
    predictionResult,
    history,
    handleSelectFile,
    clearSelection,
    classify,
    clearHistory
  };
}
