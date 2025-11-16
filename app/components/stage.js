"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Stage({ Emotion, Time, Video, Views, Insights, isActive = false }) {
    const [displayTime, setDisplayTime] = useState(Time ?? 0);
    const prevActiveRef = useRef(false);

    // Reset time when this item becomes active
    useEffect(() => {
        if (isActive && !prevActiveRef.current) {
            // Item just became active, reset the timer
            // eslint-disable-next-line
            setDisplayTime(Time ?? 0);
        }
        prevActiveRef.current = isActive;
    }, [isActive, Time]);

    // Only countdown when this item is active
    useEffect(() => {
        if (!isActive || displayTime <= 0) return;

        const id = setInterval(() => {
            setDisplayTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(id);
    }, [isActive, displayTime]);

    const placeholderEmotion = Emotion ?? "No Emotion";
    const placeholderVideo = Video ?? "/images/face.png";
    const placeholderViews = Views ?? 0;

    const placeholderInsights = {
        Primary: {
            Emotion: Insights?.Primary?.Emotion ?? "Primary",
            Metric: Insights?.Primary?.Metric ?? 0,
        },
        Secondary: {
            Emotion: Insights?.Secondary?.Emotion ?? "Secondary",
            Metric: Insights?.Secondary?.Metric ?? 0,
        },
        Teritary: {
            Emotion: Insights?.Teritary?.Emotion ?? "Teritary",
            Metric: Insights?.Teritary?.Metric ?? 0,
        },
    };

    return (
        <div className="bg-gray-800 p-[16px] rounded-[12px] gap-[24px] flex flex-row w-full">
            <Image
                src={placeholderVideo}
                alt="My photo"
                width={40}
                height={40}
                className="rounded-[8px] overflow-hidden min-h-[80px] min-w-[80px] object-cover"
            />
            <div className="flex flex-col gap-[12px] w-full">
                <div className="flex flex-row gap-[4px]">
                    <p className="text-white">{placeholderEmotion}</p>
                    <p className="text-white">{displayTime}</p>
                </div>

                <p className="text-white opacity-60">{placeholderViews} Views</p>

                <div className="flex flex-row min-w-full gap-[12px] ">
                    <p className="flex flex-row justify-between text-white gap-[4px]">
                        <span>{placeholderInsights.Primary.Emotion}</span>
                        <span className="opacity-70">
                            {placeholderInsights.Primary.Metric}%
                        </span>
                    </p>

                    <p className="text-white">|</p>

                    <p className="flex flex-row justify-between text-white gap-[4px]">
                        <span>{placeholderInsights.Secondary.Emotion}</span>
                        <span className="opacity-70">
                            {placeholderInsights.Secondary.Metric}%
                        </span>
                    </p>

                    <p className="text-white">|</p>

                    <p className="flex flex-row justify-between text-white gap-[4px]">
                        <span>{placeholderInsights.Teritary.Emotion}</span>
                        <span className="opacity-70">
                            {placeholderInsights.Teritary.Metric}%
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}