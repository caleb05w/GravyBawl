"use client";

import React, { useState, useEffect, useRef } from "react";
import Stage from "./stage";
import { getEmotionalData, removeEmotionalDataById } from "../data/EmotionData";

export default function StageQueue() {
    const [Items, setItems] = useState([]);
    const [activeId, setActiveId] = useState(null);

    // track the current timeout and active ID
    const timerRef = useRef(null);
    const activeIdRef = useRef(null);

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

    // Manage the countdown for the OLDEST item only
    useEffect(() => {
        // If no items, clear any running timer
        if (!Items.length) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            activeIdRef.current = null;
            // eslint-disable-next-line
            setActiveId(null);
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

        activeIdRef.current = oldest.id;
        setActiveId(oldest.id);

        timerRef.current = setTimeout(() => {
            removeEmotionalDataById(oldest.id);
            timerRef.current = null;
            activeIdRef.current = null;
            setActiveId(null);
            // Once removed, Items will update via "data-updated"
            // and this effect will run again for the next oldest
        }, oldest.Time * 1000); // Time is in seconds
    }, [Items]);

    return (
        <div className="flex flex-col gap-[12px]">
            {Items.map((item, index) => (
                <Stage
                    key={item.id}
                    Time={item.Time}
                    Emotion={item.Emotion}
                    Views={item.Views}
                    Insights={item.Insights}
                    isActive={index === 0 && activeId === item.id}
                />
            ))}
        </div>
    );
}