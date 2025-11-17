// data/EmotionData.js
import { getBaseMetrics } from "./BaseMetrics";
import { getFinalMetrics, clearFinalMetrics } from "./EmotionMetrics";

const STORAGE_KEY = "bawl-gravy-emotion-data";

// Load from localStorage on initialization
function loadFromStorage() {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Error loading emotion data from localStorage:", error);
    }

    return [];
}

// Save to localStorage
function saveToStorage(data) {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving emotion data to localStorage:", error);
    }
}

let data = loadFromStorage();

// Listen for storage changes from other tabs
if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY && e.newValue !== null) {
            try {
                data = JSON.parse(e.newValue);
                window.dispatchEvent(new Event("data-updated"));
            } catch (error) {
                console.error("Error parsing emotion data from storage event:", error);
            }
        }
    });
}

export function getEmotionalData() {
    return data;
}

export function setEmotionalData(newItem) {
    data = [...data, newItem];
    saveToStorage(data);
    console.log("EmotionalData updated:", data);

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("data-updated"));
    }
}

export function removeEmotionalDataById(id) {
    const item = data.find((item) => item.id === id);
    data = data.filter((item) => item.id !== id);
    saveToStorage(data);
    console.log("EmotionalData after removal:", data);

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("data-updated"));
    }

    // Return the removed item so we can apply its effect
    return item;
}

export function clearEmotionalData() {
    data = [];
    saveToStorage(data);
    console.log("EmotionalData cleared");

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("data-updated"));
    }
}

// emotion: string, time: any (string/number) – you decide format
export function generateInsights(emotion, time) {
    if (!emotion) return;

    const key = emotion.trim().toLowerCase();
    // Use final metrics if available (from previous emotion), otherwise use base metrics (first emotion)
    const finalMetrics = getFinalMetrics();
    const startingMetrics = finalMetrics || getBaseMetrics();

    // Clear final metrics after using them
    if (finalMetrics) {
        clearFinalMetrics();
    }

    let newItem;

    if (key === "happy") {
        newItem = {
            id: Date.now(),
            Time: time,
            Emotion: "Happy",
            Video: "/images/HappBawl.mp4",
            Views: startingMetrics.Views,
            MessagesPerMinute: startingMetrics.MessagesPerMinute,
            Followers: startingMetrics.Followers,
            Subscribers: startingMetrics.Subscribers,
            Insights: {
                Primary: { Emotion: "Joy", Metric: 57 },
                Secondary: { Emotion: "Excited", Metric: 12 },
                Teritary: { Emotion: "Intrigued", Metric: 15 },
            },
        };
    }

    if (key === "sad") {
        newItem = {
            id: Date.now(),
            Time: time,
            Emotion: "Sad",
            Video: "/images/SadBawl.mp4",
            Views: startingMetrics.Views,
            MessagesPerMinute: startingMetrics.MessagesPerMinute,
            Followers: startingMetrics.Followers,
            Subscribers: startingMetrics.Subscribers,
            Insights: {
                Primary: { Emotion: "Sad", Metric: 62 },
                Secondary: { Emotion: "Angst", Metric: 21 },
                Teritary: { Emotion: "Fear", Metric: 17 },
            },
        };
    }

    if (key === "anger-sad") {
        newItem = {
            id: Date.now(),
            Time: time,
            Video: "/images/AngerSad.mp4",
            Emotion: "Anger - Sad",
            Views: startingMetrics.Views,
            MessagesPerMinute: startingMetrics.MessagesPerMinute,
            Followers: startingMetrics.Followers,
            Subscribers: startingMetrics.Subscribers,
            Insights: {
                Primary: { Emotion: "Pissed", Metric: 70 },
                Secondary: { Emotion: "Nervous", Metric: 18 },
                Teritary: { Emotion: "Fearful", Metric: 12 },
            },
        };
    }

    if (key === "idle") {
        newItem = {
            id: Date.now(),
            Time: time,
            Emotion: "Idle",
            Views: startingMetrics.Views,
            MessagesPerMinute: startingMetrics.MessagesPerMinute,
            Followers: startingMetrics.Followers,
            Subscribers: startingMetrics.Subscribers,
            Insights: {
                Primary: { Emotion: "Bored", Metric: 54 },
                Secondary: { Emotion: "Neutral", Metric: 29 },
                Teritary: { Emotion: "Curious", Metric: 17 },
            },
        };
    }

    if (!newItem) {
        console.warn("generateInsights: unknown emotion:", emotion);
        return;
    }

    setEmotionalData(newItem);
}