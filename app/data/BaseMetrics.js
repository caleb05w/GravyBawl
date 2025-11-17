// data/BaseMetrics.js
const STORAGE_KEY = "bawl-gravy-base-metrics";

const defaultMetrics = {
    Views: 1000,
    MessagesPerMinute: 40,
    Followers: 10000,
    Subscribers: 7000,
};

// Load from localStorage on initialization
function loadFromStorage() {
    if (typeof window === "undefined") return defaultMetrics;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return { ...defaultMetrics, ...parsed };
        }
    } catch (error) {
        console.error("Error loading base metrics from localStorage:", error);
    }

    return defaultMetrics;
}

// Save to localStorage
function saveToStorage(metrics) {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    } catch (error) {
        console.error("Error saving base metrics to localStorage:", error);
    }
}

let baseMetrics = loadFromStorage();

// Listen for storage changes from other tabs
if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
            try {
                const parsed = JSON.parse(e.newValue);
                baseMetrics = { ...defaultMetrics, ...parsed };
                window.dispatchEvent(new Event("base-metrics-updated"));
            } catch (error) {
                console.error("Error parsing base metrics from storage event:", error);
            }
        }
    });
}

export function getBaseMetrics() {
    return { ...baseMetrics };
}

export function setBaseMetrics(newMetrics) {
    baseMetrics = { ...baseMetrics, ...newMetrics };
    saveToStorage(baseMetrics);
    console.log("BaseMetrics updated:", baseMetrics);

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("base-metrics-updated"));
    }
}

export function applyEmotionEffect(emotion) {
    if (!emotion) return;

    // Normalize emotion string: lowercase and replace spaces/hyphens
    const key = emotion.trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");
    const current = getBaseMetrics();
    let changes = {};

    if (key === "happy") {
        // Happy increases everything by 5-10%
        changes = {
            Views: Math.floor(current.Views * (1 + (Math.random() * 0.05 + 0.05))),
            MessagesPerMinute: Math.floor(current.MessagesPerMinute * (1 + (Math.random() * 0.05 + 0.05))),
            Followers: Math.floor(current.Followers * (1 + (Math.random() * 0.05 + 0.05))),
            Subscribers: Math.floor(current.Subscribers * (1 + (Math.random() * 0.05 + 0.05))),
        };
    } else if (key === "sad") {
        // Sad decreases everything by 5-10%
        changes = {
            Views: Math.max(0, Math.floor(current.Views * (1 - (Math.random() * 0.05 + 0.05)))),
            MessagesPerMinute: Math.max(0, Math.floor(current.MessagesPerMinute * (1 - (Math.random() * 0.05 + 0.05)))),
            Followers: Math.max(0, Math.floor(current.Followers * (1 - (Math.random() * 0.05 + 0.05)))),
            Subscribers: Math.max(0, Math.floor(current.Subscribers * (1 - (Math.random() * 0.05 + 0.05)))),
        };
    } else if (key === "anger-sad" || key === "anger--sad") {
        // Anger-Sad decreases everything by 5-10%
        changes = {
            Views: Math.max(0, Math.floor(current.Views * (1 - (Math.random() * 0.05 + 0.05)))),
            MessagesPerMinute: Math.max(0, Math.floor(current.MessagesPerMinute * (1 - (Math.random() * 0.05 + 0.05)))),
            Followers: Math.max(0, Math.floor(current.Followers * (1 - (Math.random() * 0.05 + 0.05)))),
            Subscribers: Math.max(0, Math.floor(current.Subscribers * (1 - (Math.random() * 0.05 + 0.05)))),
        };
    } else if (key === "idle") {
        // Idle changes things randomly (can go up or down)
        changes = {
            Views: Math.max(0, Math.floor(current.Views * (1 + (Math.random() * 0.1 - 0.05)))),
            MessagesPerMinute: Math.max(0, Math.floor(current.MessagesPerMinute * (1 + (Math.random() * 0.1 - 0.05)))),
            Followers: Math.max(0, Math.floor(current.Followers * (1 + (Math.random() * 0.1 - 0.05)))),
            Subscribers: Math.max(0, Math.floor(current.Subscribers * (1 + (Math.random() * 0.1 - 0.05)))),
        };
    }

    if (Object.keys(changes).length > 0) {
        setBaseMetrics(changes);
    }
}

