function randomTag() {
    return Math.random() < 0.5 ? "Donations" : "Followers";
}

// Get a random face image (face1 through face10)
export function getRandomFace() {
    const faceNumber = Math.floor(Math.random() * 12) + 1; // 1-10
    return `/images/face${faceNumber}.png`;
}

// Pool of available notifications to randomly add
const notificationPool = [
    {
        Img: "/images/face.png",
        Header: "New Follower",
        Body: "ShadowByte just followed!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Donation",
        Body: "Luna dropped $5 — \"Keep up the great vibes!\"",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Subscriber",
        Body: "NovaPrime subscribed for 3 months!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Raid!",
        Body: "You were raided by 27 viewers from PixelPenguin!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Clip Created",
        Body: "Chat clipped your insane headshot!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Hype Train",
        Body: "Hype Train Level 2 is kicking off!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Gifted Sub",
        Body: "CoffeeCat gifted 3 subs!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Bit Donation",
        Body: "GalacticGamer cheered 200 bits!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Milestone",
        Body: "You just hit 2,000 followers!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Mod Action",
        Body: "Your mod muted ToxicTom for 10 minutes.",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Chat Highlight",
        Body: "\"This stream is wild today!\" – FroyoKing",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Prediction",
        Body: "A new prediction has started: Win or Throw?",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Achievement",
        Body: "Longest no-death streak this session!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "New Viewer",
        Body: "LilPixel: \"First time here, love the energy!\"",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "System",
        Body: "Stream dropped frames — connection stabilizing.",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Poll Started",
        Body: "Chat wants to decide your next champion.",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "VIP Awarded",
        Body: "You gave VIP to StarrySky!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "First-Time Chatter",
        Body: "PixelRush: \"Sup streamer!\"",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Emote Spam",
        Body: "Chat is spamming PogU like crazy.",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Achievement",
        Body: "Top damage in the match — you're cracked!",
        Tag: randomTag(),
    },
];

// Start with empty notification list
let notificationData = [];

export default notificationData;

const STORAGE_KEY = "bawl-gravy-notifications";

// Load from localStorage on initialization
// Always start with empty array - notifications will be added automatically
function loadFromStorage() {
    // Always return empty array on initialization
    // Notifications will be added automatically over time
    if (typeof window !== "undefined") {
        // Clear any existing notifications from localStorage to ensure fresh start
        localStorage.removeItem(STORAGE_KEY);
    }
    return [];
}

// Get a random notification from the pool
export function getRandomNotification() {
    const randomIndex = Math.floor(Math.random() * notificationPool.length);
    const baseNotification = notificationPool[randomIndex];
    return {
        ...baseNotification,
        Tag: randomTag(),
        Img: getRandomFace() // Randomize the face image
    };
}

// Save to localStorage
function saveToStorage(data) {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving notifications to localStorage:", error);
    }
}

// Initialize notificationData from storage
notificationData = loadFromStorage();

// Listen for storage changes from other tabs
if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY && e.newValue !== null) {
            try {
                notificationData = JSON.parse(e.newValue);
                window.dispatchEvent(new Event("notifications-updated"));
            } catch (error) {
                console.error("Error parsing notifications from storage event:", error);
            }
        }
    });
}

export function fetchData() {
    return notificationData;
}

export function setData(data) {
    notificationData = data;
    saveToStorage(data);
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("notifications-updated"));
    }
}

// Add a random notification to the list
export function addRandomNotification() {
    const randomNotif = {
        ...getRandomNotification(),
        id: Date.now() + Math.random(), // Unique ID for tracking
    };
    notificationData = [randomNotif, ...notificationData];
    saveToStorage(notificationData);
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("notifications-updated"));
    }
    return randomNotif;
}
