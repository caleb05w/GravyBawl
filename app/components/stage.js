"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { FaExpandAlt } from "react-icons/fa";

export default function Stage({
    Emotion,
    Time,
    Video,
    Views,
    Insights,
    MessagesPerMinute,
    Followers,
    Subscribers,
    isActive = false,
    isInitializing = false,
    onMetricsUpdate,
}) {
    const [displayTime, setDisplayTime] = useState(Time ?? 0);
    const [isViewersHidden, setIsViewersHidden] = useState(true);
    const prevActiveRef = useRef(false);

    // Fluctuating metrics state
    const [fluctuatingViews, setFluctuatingViews] = useState(Views ?? 0);
    const [fluctuatingMessagesPerMinute, setFluctuatingMessagesPerMinute] =
        useState(MessagesPerMinute ?? 0);
    const [fluctuatingFollowers, setFluctuatingFollowers] = useState(
        Followers ?? 0
    );
    const [fluctuatingSubscribers, setFluctuatingSubscribers] = useState(
        Subscribers ?? 0
    );
    const [fluctuatingInsights, setFluctuatingInsights] = useState({
        Primary: {
            Emotion: Insights?.Primary?.Emotion ?? "Primary",
            Metric: Insights?.Primary?.Metric ?? 0,
            Color: Insights?.Primary?.Color ?? "#FFFFFF",
        },
        Secondary: {
            Emotion: Insights?.Secondary?.Emotion ?? "Secondary",
            Metric: Insights?.Secondary?.Metric ?? 0,
            Color: Insights?.Secondary?.Color ?? "#FFFFFF",
        },
        Teritary: {
            Emotion: Insights?.Teritary?.Emotion ?? "Teritary",
            Metric: Insights?.Teritary?.Metric ?? 0,
            Color: Insights?.Teritary?.Color ?? "#FFFFFF",
        },
    });

    // Initialize fluctuating values when props change
    const prevViewsRef = useRef(Views);
    const prevMessagesPerMinuteRef = useRef(MessagesPerMinute);
    const prevFollowersRef = useRef(Followers);
    const prevSubscribersRef = useRef(Subscribers);
    const prevInsightsRef = useRef(Insights);

    // Track emotion to detect emotion changes
    const prevEmotionRef = useRef(Emotion);

    useEffect(() => {
        const emotionChanged = prevEmotionRef.current !== Emotion;
        prevEmotionRef.current = Emotion;

        // Deep compare Insights object
        const insightsChanged =
            prevInsightsRef.current?.Primary?.Emotion !== Insights?.Primary?.Emotion ||
            prevInsightsRef.current?.Primary?.Metric !== Insights?.Primary?.Metric ||
            prevInsightsRef.current?.Secondary?.Emotion !== Insights?.Secondary?.Emotion ||
            prevInsightsRef.current?.Secondary?.Metric !== Insights?.Secondary?.Metric ||
            prevInsightsRef.current?.Teritary?.Emotion !== Insights?.Teritary?.Emotion ||
            prevInsightsRef.current?.Teritary?.Metric !== Insights?.Teritary?.Metric;

        if (
            prevViewsRef.current !== Views ||
            prevMessagesPerMinuteRef.current !== MessagesPerMinute ||
            prevFollowersRef.current !== Followers ||
            prevSubscribersRef.current !== Subscribers ||
            insightsChanged
        ) {
            prevViewsRef.current = Views;
            prevMessagesPerMinuteRef.current = MessagesPerMinute;
            prevFollowersRef.current = Followers;
            prevSubscribersRef.current = Subscribers;
            prevInsightsRef.current = Insights;

            // Sync baseline values when emotion changes (or on first load)
            if (emotionChanged) {
                // Use setTimeout to avoid synchronous setState in effect
                setTimeout(() => {
                    setFluctuatingViews(Views ?? 0);
                    setFluctuatingMessagesPerMinute(MessagesPerMinute ?? 0);
                    setFluctuatingFollowers(Followers ?? 0);
                    setFluctuatingSubscribers(Subscribers ?? 0);
                    setFluctuatingInsights({
                        Primary: {
                            Emotion: Insights?.Primary?.Emotion ?? "Primary",
                            Metric: Insights?.Primary?.Metric ?? 0,
                            Color: Insights?.Primary?.Color ?? "#FFFFFF",
                        },
                        Secondary: {
                            Emotion: Insights?.Secondary?.Emotion ?? "Secondary",
                            Metric: Insights?.Secondary?.Metric ?? 0,
                            Color: Insights?.Secondary?.Color ?? "#FFFFFF",
                        },
                        Teritary: {
                            Emotion: Insights?.Teritary?.Emotion ?? "Teritary",
                            Metric: Insights?.Teritary?.Metric ?? 0,
                            Color: Insights?.Teritary?.Color ?? "#FFFFFF",
                        },
                    });
                }, 0);
            }
        }
    }, [Views, MessagesPerMinute, Followers, Subscribers, Insights, Emotion]);

    // Reset time when this item becomes active
    useEffect(() => {
        if (isActive && !prevActiveRef.current) {
            setTimeout(() => {
                setDisplayTime(Time ?? 0);
            }, 0);
        }
        prevActiveRef.current = isActive;
    }, [isActive, Time]);

    // Only countdown when this item is active
    useEffect(() => {
        if (!isActive) return;

        // Reset time when becoming active
        setTimeout(() => {
            setDisplayTime(Time ?? 0);
        }, 0);

        const id = setInterval(() => {
            setDisplayTime((prev) => {
                if (prev <= 0) {
                    clearInterval(id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [isActive, Time]);

    // Fluctuate viewers every 1 second
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFluctuatingViews((prev) => {
                const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
                const newValue = Math.max(0, prev + change);
                return newValue;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Fluctuate messages per minute every 0.5 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFluctuatingMessagesPerMinute((prev) => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const newValue = Math.max(0, prev + change);
                return newValue;
            });
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    // Fluctuate followers every 3 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFluctuatingFollowers((prev) => {
                const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
                const newValue = Math.max(0, prev + change);
                return newValue;
            });
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    // Fluctuate subscribers every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFluctuatingSubscribers((prev) => {
                const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
                const newValue = Math.max(0, prev + change);
                return newValue;
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    // Fluctuate insight metrics on their own timer (every 0.1 seconds)
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFluctuatingInsights((prev) => {
                const fluctuateMetric = (current) => {
                    const change = Math.random() * 1 - 0.5; // -0.5 to +0.5
                    return Math.max(
                        0,
                        Math.min(100, Math.round((current + change) * 10) / 10)
                    );
                };

                return {
                    Primary: {
                        ...prev.Primary,
                        Metric: fluctuateMetric(prev.Primary.Metric),
                        Color: prev.Primary.Color,
                    },
                    Secondary: {
                        ...prev.Secondary,
                        Metric: fluctuateMetric(prev.Secondary.Metric),
                        Color: prev.Secondary.Color,
                    },
                    Teritary: {
                        ...prev.Teritary,
                        Metric: fluctuateMetric(prev.Teritary.Metric),
                        Color: prev.Teritary.Color,
                    },
                };
            });
        }, 100);

        return () => clearInterval(intervalId);
    }, []);

    // ✅ Report current metrics to parent whenever they change (throttled to prevent infinite loops)
    const onMetricsUpdateRef = useRef(onMetricsUpdate);
    const lastUpdateRef = useRef(0);

    useEffect(() => {
        onMetricsUpdateRef.current = onMetricsUpdate;
    }, [onMetricsUpdate]);

    useEffect(() => {
        if (!onMetricsUpdateRef.current || !isActive) return;

        // Throttle updates to every 100ms to prevent excessive calls
        const now = Date.now();
        if (now - lastUpdateRef.current < 100) return;
        lastUpdateRef.current = now;

        onMetricsUpdateRef.current({
            Views: fluctuatingViews,
            MessagesPerMinute: fluctuatingMessagesPerMinute,
            Followers: fluctuatingFollowers,
            Subscribers: fluctuatingSubscribers,
            Insights: fluctuatingInsights,
            RemainingTime: displayTime,
            Emotion: Emotion ?? "No Emotion",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isActive,
        fluctuatingViews,
        fluctuatingMessagesPerMinute,
        fluctuatingFollowers,
        fluctuatingSubscribers,
        displayTime,
        Emotion,
        // Note: fluctuatingInsights is intentionally excluded to prevent infinite loops
        // It updates every 100ms and would cause constant re-renders
    ]);

    const placeholderEmotion = Emotion ?? "No Emotion";
    const placeholderVideo = Video ?? "/images/Idle-Loop.mp4";

    return (
        <div className={`rounded-[12px] gap-[24px] flex flex-col w-[600px] h-fit bg-[#0c0c0c] pb-[24px] ${isInitializing ? 'stage-initialize' : ''}`}>
            <div className={`flex flex-row justify-between align-middle items-center h-fit w-full px-[24px] pt-[24px] ${isInitializing ? 'stage-header' : ''}`}>
                <div className="flex flex-row gap-[8px]">
                    <button className="rounded-full bg-red-500 w-[12px] h-[12px]"></button>
                    <button className="rounded-full bg-yellow-500 w-[12px] h-[12px]"></button>
                    <button className="rounded-full bg-green-500 w-[12px] h-[12px]"></button>
                </div>
                <div className="flex flex-row gap-[8px]">
                    <FaBell className='text-white' />
                    <FaExpandAlt className='text-white' />
                </div>
            </div>
            <div className=" border-[0.5px] border-white/10"></div>
            <div className={`flex flex-row w-auto h-[20rem] justify-center px-[16px] ${isInitializing ? 'stage-video' : 'stage-video-default'}`}>
                <video
                    key={placeholderVideo || "placeholder"}
                    className="max-w-[50%] max-h-hug object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source
                        src={placeholderVideo || "/images/Idle-Loop.mp4"}
                        type="video/mp4"
                    />
                </video>
            </div>

            <div className="flex flex-row flex-wrap min-w-full gap-[12px] justify-center items-center px-[16px]">
                <div className={`flex flex-row justify-between items-center text-white gap-[12px] px-[12px] py-[2px] ${isInitializing ? 'stage-insight-1' : ''}`}>
                    <span className="flex flex-row items-center gap-[8px]">
                        <div
                            className="rounded-full w-[8px] h-[8px]"
                            style={{ backgroundColor: fluctuatingInsights.Primary.Color }}
                        ></div>
                        <h5> {fluctuatingInsights.Primary.Emotion} </h5>
                    </span>
                    <span>
                        <h5>{fluctuatingInsights.Primary.Metric.toFixed(1)}%</h5>
                    </span>
                </div>
                <span className='text-white border border-white/10 h-[20px] w-px self-center hidden sm:block'></span>

                <div className={`flex flex-row justify-between items-center text-white gap-[12px] px-[12px] py-[2px] ${isInitializing ? 'stage-insight-2' : ''}`}>
                    <span className="flex flex-row items-center gap-[8px]">
                        <div
                            className="rounded-full w-[8px] h-[8px]"
                            style={{ backgroundColor: fluctuatingInsights.Secondary.Color }}
                        ></div>
                        <h5>{fluctuatingInsights.Secondary.Emotion}</h5>
                    </span>
                    <span>
                        <h5>{fluctuatingInsights.Secondary.Metric.toFixed(1)}%</h5>
                    </span>
                </div>
                <span className='text-white border border-white/10 h-[20px] w-px self-center hidden sm:block'></span>
                <div className={`flex flex-row justify-between items-center text-white gap-[12px] px-[12px] py-[2px] ${isInitializing ? 'stage-insight-3' : ''}`}>
                    <span className="flex flex-row items-center gap-[8px]">
                        <div
                            className="rounded-full w-[8px] h-[8px]"
                            style={{ backgroundColor: fluctuatingInsights.Teritary.Color }}
                        ></div>
                        <h5>{fluctuatingInsights.Teritary.Emotion}</h5>
                    </span>
                    <span>
                        <h5>{fluctuatingInsights.Teritary.Metric.toFixed(1)}%</h5>
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-[12px] w-full px-[16px]">
                <div className="flex flex-row gap-[8px]">
                    <div className={`flex flex-col items-center justify-center w-full h-[120px] p-[2px] rounded-xl border border-white/10 backdrop-blur-md ${isInitializing ? 'stage-metric-1' : ''}`}>
                        <div className="rounded-xl bg-[#101010]/30 backdrop-blur-sm p-4 w-full">
                            <div className="flex flex-col items-center justify-center text-center">
                                <h2 className="text-white text-xl font-semibold">
                                    {isViewersHidden ? fluctuatingViews : "--"}
                                </h2>
                                <div className="flex flex-row items-center align-top gap-[4px] justify-center">
                                    <h6 className="text-white opacity-70 text-sm">Viewers</h6>
                                    <button
                                        onClick={() => setIsViewersHidden(!isViewersHidden)}
                                        className="text-white opacity-70 hover:opacity-100 transition-opacity cursor-pointer h-full mb-[4px] "
                                        aria-label={isViewersHidden ? "Show viewers" : "Hide viewers"}
                                    >
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            {isViewersHidden ? (
                                                <>
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </>
                                            ) : (
                                                <>
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </>
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col items-center justify-center w-full h-[120px] p-[2px] rounded-xl border border-white/10 backdrop-blur-md ${isInitializing ? 'stage-metric-2' : ''}`}>
                        <div className="rounded-xl bg-[#0C0C0C]/30 backdrop-blur-sm p-4 w-full">
                            <div className="flex flex-col items-center justify-center text-center">
                                <h2 className="text-white text-xl font-semibold">
                                    {fluctuatingMessagesPerMinute}
                                </h2>
                                <h6 className="text-white opacity-70 text-sm">Messages/min</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-[8px]">
                    <div className={`flex flex-col items-center justify-center w-full h-[120px] p-[2px] rounded-xl border border-white/10 backdrop-blur-md ${isInitializing ? 'stage-metric-3' : ''}`}>
                        <div className="rounded-xl bg-[#101010]/30 backdrop-blur-sm p-4 w-full">
                            <div className="flex flex-col items-center justify-center text-center">
                                <h2 className="text-white text-xl font-semibold">
                                    {fluctuatingFollowers}
                                </h2>
                                <h6 className="text-white opacity-70 text-sm">Followers</h6>
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col items-center justify-center w-full h-[120px] p-[2px] rounded-xl border border-white/10 backdrop-blur-md ${isInitializing ? 'stage-metric-4' : ''}`}>
                        <div className="rounded-xl bg-[#101010]/30 backdrop-blur-sm p-4 w-full">
                            <div className="flex flex-col items-center justify-center text-center">
                                <h2 className="text-white text-xl font-semibold">
                                    {fluctuatingSubscribers}
                                </h2>
                                <h6 className="text-white opacity-70 text-sm">Subscribers</h6>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="flex flex-row gap-[24px]">
                    <p className="text-white">{placeholderEmotion}</p>
                    <div className="flex flex-row gap-[4px]">
                        <p className="text-white opacity-60"> Time: </p>
                        <p className="text-white">{displayTime}s</p>
                    </div>
                </div> */}
            </div>
        </div>
    );
}