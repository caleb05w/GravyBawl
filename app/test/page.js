"use client"

import React, { useState, useEffect, useRef } from "react";
import { getData, setData } from "../components/data";
import NotificationList from "../components/notificationList";
import DevPanel from "../components/devPanel";
import Stage from "../components/stage";
import { getEmotionalData } from "../data/EmotionData";
import { getBaseMetrics } from "../data/BaseMetrics";
import { generateInsights } from "../data/EmotionData";
import { getActiveId } from "../components/stageQueue";
import { setFinalMetrics } from "../data/EmotionMetrics";
import { MdCastConnected } from "react-icons/md";

export default function Test() {
    const [items, setItems] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [baseMetrics, setBaseMetrics] = useState(getBaseMetrics());

    // 🔥 store latest metrics in both state + ref
    const [stageMetrics, setStageMetrics] = useState(null);
    const stageMetricsRef = useRef(null);

    // Subscribe to data updates
    useEffect(() => {
        const update = () => {
            const newItems = getEmotionalData();
            setItems(newItems);
        };

        window.addEventListener("data-updated", update);
        update();

        return () => window.removeEventListener("data-updated", update);
    }, []);

    // Subscribe to active ID updates
    useEffect(() => {
        const update = () => {
            setActiveId(getActiveId());
        };

        window.addEventListener("active-id-updated", update);
        update();

        return () => window.removeEventListener("active-id-updated", update);
    }, []);

    // Subscribe to base metrics updates
    useEffect(() => {
        const update = () => {
            setBaseMetrics(getBaseMetrics());
        };

        window.addEventListener("base-metrics-updated", update);
        update();

        return () => window.removeEventListener("base-metrics-updated", update);
    }, []);

    // Get the active item (first item in queue is always active)
    const activeItem = items.length > 0 ? items[0] : null;
    const isInitializing = items.length === 1; // Only animate when it's the first/only item

    // Listen for emotion ending event to capture final metrics
    // This is the ONLY place where we capture final metrics - when emotion actually ends
    useEffect(() => {
        const handleEmotionEnding = () => {
            // Capture the current metrics right before the emotion is removed
            if (stageMetricsRef.current) {
                setFinalMetrics(stageMetricsRef.current);
                console.log("Final metrics captured:", stageMetricsRef.current);
            }
        };

        window.addEventListener("emotion-ending", handleEmotionEnding);
        return () => window.removeEventListener("emotion-ending", handleEmotionEnding);
    }, []);

    // ✅ Callback to receive metrics from Stage component
    const handleMetricsUpdate = (metrics) => {
        stageMetricsRef.current = metrics; // keep always-latest snapshot
        setStageMetrics(metrics);          // optional: reactive state for UI / debugging
    };

    const message = getData;

    useEffect(() => {
        console.log(getData());
    }, []);

    return (
        <div className="page flex flex-row gap-[58px]">

            <div className="flex flex-col gap-[24px]">
                {activeItem ? (
                    <Stage
                        Time={activeItem.Time}
                        Video={activeItem.Video}
                        Emotion={activeItem.Emotion}
                        Views={activeItem.Views}
                        MessagesPerMinute={activeItem.MessagesPerMinute}
                        Followers={activeItem.Followers}
                        Subscribers={activeItem.Subscribers}
                        Insights={activeItem.Insights}
                        isActive={true}
                        isInitializing={isInitializing}
                        onMetricsUpdate={handleMetricsUpdate} // 🔥 important
                    />
                ) : (
                    <div className="rounded-[12px] gap-[8px] flex flex-col items-center justify-center w-[100vw] h-[100vh] bg-[#0F0F0F] pb-[24px] p-[24px]">
                        <MdCastConnected className='text-white text-2xl' />
                        <div className="flex flex-col gap-[4px] items-center">
                            <h5 className="text-white">
                                Stream Detected
                            </h5>
                            <h6 className="text-white flex items-center gap-1">
                                Connecting
                                <span className="inline-flex gap-1 align-bottom justify-end  items-end h-[10px]">
                                    <span className="loading-dot-1 w-[2px] h-[2px] bg-white rounded-full"></span>
                                    <span className="loading-dot-2 w-[2px] h-[2px] bg-white rounded-full"></span>
                                    <span className="loading-dot-3 w-[2px] h-[2px] bg-white rounded-full"></span>
                                </span>
                            </h6>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}