// data/EmotionData.js
let data = [];

export function getEmotionalData() {
    return data;
}

export function setEmotionalData(newItem) {
    data = [...data, newItem];
    console.log("EmotionalData updated:", data);

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("data-updated"));
    }
}

export function removeEmotionalDataById(id) {
    data = data.filter((item) => item.id !== id);
    console.log("EmotionalData after removal:", data);

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("data-updated"));
    }
}

// emotion: string, time: any (string/number) – you decide format
export function generateInsights(emotion, time) {
    if (!emotion) return;

    const key = emotion.trim().toLowerCase();
    let newItem;

    if (key === "happy") {
        newItem = {
            id: Date.now(),
            Time: time,
            Emotion: "Happy",
            Views: 1200,
            Insights: {
                Primary: { Emotion: "Happy", Metric: 57 },
                Secondary: { Emotion: "Happy", Metric: 12 },
                Teritary: { Emotion: "Happy", Metric: 15 },
            },
        };
    }

    if (key === "sad") {
        newItem = {
            id: Date.now(),
            Time: time,
            Emotion: "Sad",
            Views: 980,
            Insights: {
                Primary: { Emotion: "Sad", Metric: 62 },
                Secondary: { Emotion: "Sad", Metric: 21 },
                Teritary: { Emotion: "Sad", Metric: 17 },
            },
        };
    }

    if (key === "excited") {
        newItem = {
            id: Date.now(),
            Time: time,
            Emotion: "Excited",
            Views: 1420,
            Insights: {
                Primary: { Emotion: "Excited", Metric: 70 },
                Secondary: { Emotion: "Excited", Metric: 18 },
                Teritary: { Emotion: "Excited", Metric: 12 },
            },
        };
    }

    if (key === "angry") {
        newItem = {
            id: Date.now(),
            Time: time,
            Emotion: "Angry",
            Views: 860,
            Insights: {
                Primary: { Emotion: "Angry", Metric: 54 },
                Secondary: { Emotion: "Angry", Metric: 29 },
                Teritary: { Emotion: "Angry", Metric: 17 },
            },
        };
    }

    if (!newItem) {
        console.warn("generateInsights: unknown emotion:", emotion);
        return;
    }

    setEmotionalData(newItem);
}