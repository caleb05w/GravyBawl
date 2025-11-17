// data/EmotionMetrics.js
// Stores final metrics from completed emotions to pass to next emotion

const STORAGE_KEY = "bawl-gravy-emotion-metrics";

// Load from localStorage on initialization
function loadFromStorage() {
    if (typeof window === "undefined") return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Error loading emotion metrics from localStorage:", error);
    }

    return null;
}

// Save to localStorage
function saveToStorage(metrics) {
    if (typeof window === "undefined") return;

    try {
        if (metrics) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch (error) {
        console.error("Error saving emotion metrics to localStorage:", error);
    }
}

let finalMetrics = loadFromStorage();

// Listen for storage changes from other tabs
if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY) {
            try {
                if (e.newValue) {
                    finalMetrics = JSON.parse(e.newValue);
                } else {
                    finalMetrics = null;
                }
            } catch (error) {
                console.error("Error parsing emotion metrics from storage event:", error);
            }
        }
    });
}

export function getFinalMetrics() {
    return finalMetrics;
}

export function setFinalMetrics(metrics) {
    finalMetrics = metrics;
    saveToStorage(metrics);
    console.log("FinalMetrics updated:", finalMetrics);
}

export function clearFinalMetrics() {
    finalMetrics = null;
    saveToStorage(null);
}

