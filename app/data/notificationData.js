function randomTag() {
    return Math.random() < 0.5 ? "Donations" : "Followers";
}

let notificationData = [
    {
        Img: "/images/face.png",
        Header: "New Follower",
        Body: "ShadowByte just followed!",
        Tag: randomTag(),
    },
    {
        Img: "/images/face.png",
        Header: "Donation",
        Body: "Luna dropped $5 — “Keep up the great vibes!”",
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
        Body: "“This stream is wild today!” – FroyoKing",
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
        Body: "LilPixel: “First time here, love the energy!”",
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
        Body: "PixelRush: “Sup streamer!”",
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

export default notificationData;

export function fetchData() {
    return notificationData;
}

export function setData(data) {
    notificationData = data;
    window.dispatchEvent(new Event("notifications-updated"));
}
