/**
 * CIFAR-10 Class definitions, metadata, sample benchmarks, and confusion matrix data.
 */

export const CIFAR10_CLASSES = [
  {
    id: 0,
    name: "airplane",
    displayName: "Airplane",
    emoji: "✈️",
    category: "Transport / Aviation",
    description: "Commercial jetliners, single-engine aircraft, biplanes, and gliders.",
    color: "#0284c7",
    accuracy: 83.1,
    precision: 0.7937,
    recall: 0.8310,
    f1: 0.8119,
    samplePrompt: "Jet airliner flying in clear skies"
  },
  {
    id: 1,
    name: "automobile",
    displayName: "Automobile",
    emoji: "🚗",
    category: "Transport / Ground",
    description: "Sedans, hatchbacks, coupes, sports cars, and racing vehicles.",
    color: "#3b82f6",
    accuracy: 93.7,
    precision: 0.8798,
    recall: 0.9370,
    f1: 0.9075,
    samplePrompt: "Modern road automobile or sedan"
  },
  {
    id: 2,
    name: "bird",
    displayName: "Bird",
    emoji: "🐦",
    category: "Animals / Avian",
    description: "Songbirds, waterfowl, raptors, and flying or perched birds.",
    color: "#10b981",
    accuracy: 59.8,
    precision: 0.7494,
    recall: 0.5980,
    f1: 0.6652,
    samplePrompt: "Small perched bird on tree branch"
  },
  {
    id: 3,
    name: "cat",
    displayName: "Cat",
    emoji: "🐱",
    category: "Animals / Feline",
    description: "Domestic cats, kittens, shorthairs, and longhairs.",
    color: "#f59e0b",
    accuracy: 57.4,
    precision: 0.6392,
    recall: 0.5740,
    f1: 0.6048,
    samplePrompt: "Domestic cat sitting indoors"
  },
  {
    id: 4,
    name: "deer",
    displayName: "Deer",
    emoji: "🦌",
    category: "Animals / Wild",
    description: "Stags, does, fawns, and antlered forest wildlife.",
    color: "#84cc16",
    accuracy: 75.1,
    precision: 0.7889,
    recall: 0.7510,
    f1: 0.7695,
    samplePrompt: "Wild deer standing in meadow"
  },
  {
    id: 5,
    name: "dog",
    displayName: "Dog",
    emoji: "🐶",
    category: "Animals / Canine",
    description: "Domestic dogs, puppies, retrievers, terriers, and hounds.",
    color: "#ec4899",
    accuracy: 73.0,
    precision: 0.6784,
    recall: 0.7300,
    f1: 0.7033,
    samplePrompt: "Friendly golden puppy playing outside"
  },
  {
    id: 6,
    name: "frog",
    displayName: "Frog",
    emoji: "🐸",
    category: "Animals / Amphibian",
    description: "Tree frogs, pond toads, and semi-aquatic amphibians.",
    color: "#14b8a6",
    accuracy: 89.8,
    precision: 0.7082,
    recall: 0.8980,
    f1: 0.7919,
    samplePrompt: "Green tree frog on leaf"
  },
  {
    id: 7,
    name: "horse",
    displayName: "Horse",
    emoji: "🐴",
    category: "Animals / Equine",
    description: "Riding horses, stallions, mares, and galloping equines.",
    color: "#8b5cf6",
    accuracy: 78.7,
    precision: 0.8629,
    recall: 0.7870,
    f1: 0.8232,
    samplePrompt: "Galloping brown horse in pasture"
  },
  {
    id: 8,
    name: "ship",
    displayName: "Ship",
    emoji: "🚢",
    category: "Transport / Maritime",
    description: "Cargo container ships, passenger cruisers, sailboats, and boats.",
    color: "#06b6d4",
    accuracy: 88.5,
    precision: 0.8948,
    recall: 0.8850,
    f1: 0.8899,
    samplePrompt: "Large cargo vessel on open ocean"
  },
  {
    id: 9,
    name: "truck",
    displayName: "Truck",
    emoji: "🚚",
    category: "Transport / Heavy",
    description: "Heavy freight trucks, trailers, delivery vans, and pickups.",
    color: "#f97316",
    accuracy: 88.0,
    precision: 0.8844,
    recall: 0.8800,
    f1: 0.8822,
    samplePrompt: "Freight semi-truck hauling cargo"
  }
];

export const MODEL_METRICS = {
  overallAccuracy: 78.71,
  macroPrecision: 78.80,
  macroRecall: 78.71,
  macroF1: 78.49,
  baselineAnnAccuracy: 50.22,
  baselineAnnF1: 49.34,
  testSamples: 10000,
  trainSamples: 40000,
  valSamples: 10000,
  totalParameters: 1196522,
  inputDimension: "3 × 32 × 32 (RGB)"
};

// Empirical confusion matrix from 10,000 test images (1,000 per class)
export const CONFUSION_MATRIX_DATA = [
  // true: airplane
  [831, 23, 38, 12, 11, 4, 8, 11, 42, 20],
  // true: automobile
  [12, 937, 2, 2, 1, 1, 3, 1, 13, 28],
  // true: bird
  [48, 4, 598, 54, 88, 57, 72, 45, 23, 11],
  // true: cat
  [14, 8, 48, 574, 46, 172, 70, 38, 14, 16],
  // true: deer
  [15, 2, 48, 38, 751, 31, 45, 56, 11, 3],
  // true: dog
  [8, 4, 38, 142, 38, 730, 18, 15, 4, 3],
  // true: frog
  [4, 2, 22, 39, 12, 14, 898, 4, 4, 1],
  // true: horse
  [14, 2, 22, 28, 42, 54, 6, 787, 6, 39],
  // true: ship
  [38, 28, 6, 4, 2, 2, 2, 1, 885, 32],
  // true: truck
  [21, 55, 4, 6, 1, 3, 2, 14, 14, 880]
];
