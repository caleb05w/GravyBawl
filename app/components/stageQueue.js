"use client";

import React, { useState, useEffect, useRef } from "react";
import { getEmotionalData, removeEmotionalDataById, clearEmotionalData } from "../data/EmotionData";
import { applyEmotionEffect } from "../data/BaseMetrics";
import { setFinalMetrics } from "../data/EmotionMetrics";

// Global state for active ID that can be accessed from anywhere
let activeIdState = null;
let activeIdListeners = new Set();

export function getActiveId() {
    return activeIdState;
}

export function setActiveId(newActiveId) {
    activeIdState = newActiveId;
    activeIdListeners.forEach(listener => listener(newActiveId));
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("active-id-updated"));
    }
}

export function subscribeToActiveId(listener) {
    activeIdListeners.add(listener);
    return () => activeIdListeners.delete(listener);
}

export default function StageQueue() {
    const [Items, setItems] = useState([]);
    const [activeId, setActiveIdLocal] = useState(null);
    const [remainingTime, setRemainingTime] = useState({});

    // track the current timeout and active ID
    const timerRef = useRef(null);
    const activeIdRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const startTimeRef = useRef(null);

    // Subscribe to global data updates
    useEffect(() => {
        const update = () => {
            const newItems = getEmotionalData();
            setItems(newItems);
        };

        window.addEventListener("data-updated", update);
        update(); // initial load

        return () => window.removeEventListener("data-updated", update);
    }, []);

    // Subscribe to active ID updates
    useEffect(() => {
        const update = () => {
            setActiveIdLocal(getActiveId());
        };

        window.addEventListener("active-id-updated", update);
        update();

        return () => window.removeEventListener("active-id-updated", update);
    }, []);

    // Countdown timer for active item (updates every 100ms for smooth progress bar)
    useEffect(() => {
        if (!activeId || !Items.length || !startTimeRef.current) {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            return;
        }

        const activeItem = Items.find(item => item.id === activeId);
        if (!activeItem) return;

        // Update remaining time every 100ms for smooth animation
        countdownIntervalRef.current = setInterval(() => {
            if (startTimeRef.current && activeItem) {
                const elapsed = (Date.now() - startTimeRef.current) / 1000;
                const remaining = Math.max(0, activeItem.Time - elapsed);
                setRemainingTime(prev => ({
                    ...prev,
                    [activeId]: remaining
                }));
            }
        }, 100);

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
        };
    }, [activeId, Items]);

    // Manage the countdown for the OLDEST item only
    useEffect(() => {
        // If no items, clear any running timer
        if (!Items.length) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            activeIdRef.current = null;
            startTimeRef.current = null;
            setActiveId(null);
            setTimeout(() => setRemainingTime({}), 0);
            return;
        }

        const oldest = Items[0]; // queue front

        // If we're already counting down this item, do nothing
        if (activeIdRef.current === oldest.id) {
            return;
        }

        // New oldest or previous was removed: reset timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }

        activeIdRef.current = oldest.id;
        startTimeRef.current = Date.now();
        setActiveId(oldest.id);
        setTimeout(() => {
            setRemainingTime(prev => ({
                ...prev,
                [oldest.id]: oldest.Time
            }));
        }, 0);

        timerRef.current = setTimeout(() => {
            // Trigger event to capture final metrics before removing
            // This gives the Stage component time to report its final metrics
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("emotion-ending"));
            }

            // Delay to ensure final metrics are captured before removing the item
            // The emotion-ending event handler will capture the metrics synchronously
            setTimeout(() => {
                const removedItem = removeEmotionalDataById(oldest.id);

                // Apply emotion effect when item ends
                if (removedItem && removedItem.Emotion) {
                    applyEmotionEffect(removedItem.Emotion);
                }

                timerRef.current = null;
                activeIdRef.current = null;
                startTimeRef.current = null;
                setActiveId(null);
                // Once removed, Items will update via "data-updated"
                // and this effect will run again for the next oldest
            }, 100); // Increased delay to ensure metrics capture completes
        }, oldest.Time * 1000); // Time is in seconds
    }, [Items]);

    const handleRemoveItem = (id) => {
        // If removing the active item, clear timers first
        if (activeIdRef.current === id) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            activeIdRef.current = null;
            startTimeRef.current = null;
            setActiveId(null);
        }
        removeEmotionalDataById(id);
    };

    const handleClearQueue = () => {
        // Clear all timers
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
        activeIdRef.current = null;
        startTimeRef.current = null;
        setActiveId(null);
        clearEmotionalData();
    };

    return (
        <div className="flex flex-col gap-[12px]">
            {Items.length === 0 ? (
                <p className="text-white text-sm opacity-60">No emotions queued</p>
            ) : (
                <>
                    {Items.map((item, index) => {
                        const isActive = index === 0 && activeId === item.id;
                        const timeLeft = isActive ? (remainingTime[item.id] ?? item.Time) : item.Time;
                        // Progress fills from 0% to 100% as time elapses
                        const progress = isActive ? ((item.Time - timeLeft) / item.Time) * 100 : 0;

                        return (
                            <div key={item.id} className="relative text-white text-sm p-[8px] border border-gray-600 rounded overflow-hidden bg-black group">
                                {/* Progress bar background - fills from 0% to 100% as time elapses */}
                                <div
                                    className="absolute inset-0 bg-white opacity-20 transition-all duration-100 ease-linear"
                                    style={{ 
                                        width: `${Math.max(0, Math.min(100, progress))}%`,
                                        left: 0,
                                        right: 'auto'
                                    }}
                                />
                                {/* Content */}
                                <div className="relative z-10 flex flex-row items-center justify-between">
                                    <span>
                                        {isActive ? "▶ " : ""}
                                        {item.Emotion} ({Math.ceil(timeLeft)}s)
                                    </span>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 text-4xl px-2 py-1 rounded leading-none"
                                        aria-label="Remove item"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    <button
                        onClick={handleClearQueue}
                        className="mt-2 text-white text-sm opacity-60 hover:opacity-100 transition-opacity border border-gray-600 rounded px-3 py-2 hover:bg-red-500/20 hover:border-red-500"
                    >
                        Clear Queue
                    </button>
                </>
            )}
        </div>
    );
}